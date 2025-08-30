import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { QUIZ_ERRORS } from "./errors"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import { ROOM_ERRORS, RoomErrorCodes } from "../rooms/errors"
import { UserErrorCodes } from "../users/errors"

export const startQuiz = internalMutation({
  args: {
    roomId: v.id("rooms"),
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()),
        correctAnswerIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const gameStateId = await ctx.db.insert("gameStates", {
      roomId: args.roomId,
      phase: "question",
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
      questionStartTime: Date.now(),
    })

    await Promise.all([
      room.gamePlayerIds.map((playerId) =>
        ctx.db.insert("playerScores", {
          gameStateId: gameStateId,
          userId: playerId,
          score: 0,
          correctAnswers: 0,
          updatedAt: Date.now(),
        })
      ),
      args.questions.map(async (question, index) => {
        await ctx.db.insert("questions", {
          gameStateId: gameStateId,
          answers: question.answers,
          correctAnswerIndex: question.correctAnswerIndex,
          questionIndex: index,
          question: question.question,
        })
      }),
    ])

    const scheduledId = await ctx.scheduler.runAfter(
      room.timePerQuestion * 1000,
      internal.quiz.mutations.nextQuestion,
      {
        roomId: args.roomId,
        gameStateId,
        nextQuestionIndex: 1,
        timePerQuestionInSeconds: room.timePerQuestion,
        totalQuestions: args.questions.length,
      }
    )

    const firstQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", 0)
      )
      .first()

    await ctx.db.patch(gameStateId, {
      currentQuestionId: firstQuestion?._id,
      questionStartTime: Date.now(),
      scheduledFunctionId: scheduledId,
    })

    await ctx.db.patch(args.roomId, {
      status: "ongoing",
      startedAt: Date.now(),
      currentGameStateId: gameStateId,
    })
  },
})

export const nextQuestion = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
    nextQuestionIndex: v.number(),
    timePerQuestionInSeconds: v.number(),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    const {
      gameStateId,
      nextQuestionIndex,
      timePerQuestionInSeconds,
      totalQuestions,
    } = args

    // Get the room to access game players
    const room = await ctx.db.get(args.roomId)
    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    // Get the current game state
    const gameState = await ctx.db.get(gameStateId)
    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    // Update scores for the question that just finished (if it's not the first question)
    if (nextQuestionIndex > 0) {
      const previousQuestionIndex = nextQuestionIndex - 1
      const previousQuestion = await ctx.db
        .query("questions")
        .withIndex("by_game_and_index", (q) =>
          q
            .eq("gameStateId", gameStateId)
            .eq("questionIndex", previousQuestionIndex)
        )
        .first()

      if (previousQuestion && gameState.questionStartTime) {
        // Update all game players' scores in parallel
        await Promise.all(
          room.gamePlayerIds.map(async (playerId) => {
            // Get player's answer for the previous question
            const playerAnswer = await ctx.db
              .query("playerAnswers")
              .withIndex("by_user_question", (q) =>
                q.eq("userId", playerId).eq("questionId", previousQuestion._id)
              )
              .first()

            if (!playerAnswer) {
              return // player did not answer the question
            }

            if (!playerAnswer.isCorrect) {
              return
            }

            // Get player's current score
            const playerScore = await ctx.db
              .query("playerScores")
              .withIndex("by_user_game", (q) =>
                q.eq("userId", playerId).eq("gameStateId", gameStateId)
              )
              .first()

            if (!playerScore) {
              throw QUIZ_ERRORS.PLAYER_SCORE_NOT_FOUND
            }

            // Calculate score: base points for correct answer + time bonus
            const timeElapsed =
              playerAnswer.answeredAt - gameState.questionStartTime!
            const maxTime = room.timePerQuestion * 1000
            const timeBonusMultiplier = Math.max(
              0,
              (maxTime - timeElapsed) / maxTime
            )

            const basePoints = 100
            const timeBonus = Math.round(basePoints * timeBonusMultiplier * 0.5) // 50% bonus for speed
            const pointsEarned = basePoints + timeBonus

            // Update player score
            await ctx.db.patch(playerScore._id, {
              score: playerScore.score + pointsEarned,
              correctAnswers: playerScore.correctAnswers + 1,
              updatedAt: Date.now(),
            })
          })
        )
      }
    }

    // Check if this is the last question
    const isLastQuestion = nextQuestionIndex >= totalQuestions
    if (isLastQuestion) {
      await ctx.db.patch(args.roomId, {
        status: "completed",
        completedAt: Date.now(),
      })

      return
    }

    // Get the next question
    const currentQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    // Schedule the next question
    const scheduledId = await ctx.scheduler.runAfter(
      timePerQuestionInSeconds * 1000,
      internal.quiz.mutations.nextQuestion,
      {
        roomId: args.roomId,
        gameStateId,
        nextQuestionIndex: nextQuestionIndex + 1,
        timePerQuestionInSeconds: timePerQuestionInSeconds,
        totalQuestions: totalQuestions,
      }
    )

    // Update game state to the next question
    await ctx.db.patch(args.gameStateId, {
      phase: "question",
      currentQuestionId: currentQuestion._id,
      currentQuestionIndex: nextQuestionIndex,
      scheduledFunctionId: scheduledId,
      questionStartTime: Date.now(),
    })
  },
})

export const submitAnswer = mutation({
  args: {
    gameStateId: v.id("gameStates"),
    answerIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw UserErrorCodes.NOT_AUTHENTICATED
    }

    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    const room = await ctx.db.get(gameState.roomId)

    if (!room) {
      throw RoomErrorCodes.ROOM_NOT_FOUND
    }

    const GRACE_PERIOD_MILLISECONDS = 3 * 1000

    const hasQuestionTimeExpired =
      gameState.questionStartTime &&
      gameState.questionStartTime +
        room.timePerQuestion * 1000 +
        GRACE_PERIOD_MILLISECONDS <
        Date.now()

    if (hasQuestionTimeExpired) {
      throw QUIZ_ERRORS.QUESTION_TIME_EXPIRED
    }

    const { gameStateId, answerIndex } = args

    if (!gameState.currentQuestionId) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    const currentQuestion = await ctx.db.get(gameState.currentQuestionId)

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    const isCorrectAnswer = answerIndex === currentQuestion.correctAnswerIndex

    // Check if player already answered this question
    const existingAnswer = await ctx.db
      .query("playerAnswers")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionId", gameState.currentQuestionId!)
      )
      .first()

    if (existingAnswer) {
      // Update existing answer
      await ctx.db.patch(existingAnswer._id, {
        answerIndex,
        answeredAt: Date.now(),
        isCorrect: isCorrectAnswer,
      })
    } else {
      // Insert new player answer
      await ctx.db.insert("playerAnswers", {
        gameStateId,
        questionId: gameState.currentQuestionId,
        userId,
        answerIndex,
        answeredAt: Date.now(),
        isCorrect: isCorrectAnswer,
      })
    }

    // Check if all players have answered the current question
    const allPlayerAnswers = await ctx.db
      .query("playerAnswers")
      .withIndex("by_question", (q) =>
        q.eq("questionId", gameState.currentQuestionId!)
      )
      .collect()

    // Get all players in the game
    const totalPlayers = room.gamePlayerIds.length
    const playersWhoAnswered = new Set(
      allPlayerAnswers.map((answer) => answer.userId)
    )

    // Check if all players have answered
    const allPlayersAnswered = playersWhoAnswered.size === totalPlayers

    if (!allPlayersAnswered) {
      return
    }

    if (!gameState.scheduledFunctionId) {
      return
    }

    // Cancel any scheduled nextQuestion function for this game state
    const scheduledFunction = await ctx.db.system.get(
      gameState.scheduledFunctionId
    )

    if (!scheduledFunction) {
      return
    }

    // Cancel all scheduled functions for this game state
    await ctx.scheduler.cancel(scheduledFunction._id)

    // Get current question to determine the next question index
    const currentQuestionIndex = gameState.currentQuestionIndex
    const nextQuestionIndex = currentQuestionIndex + 1

    // Get total questions count
    const totalQuestions = await ctx.db
      .query("questions")
      .withIndex("by_game_state", (q) => q.eq("gameStateId", gameStateId))
      .collect()

    // Immediately call nextQuestion
    await ctx.scheduler.runAfter(
      0, // Run immediately
      internal.quiz.mutations.nextQuestion,
      {
        roomId: room._id,
        gameStateId,
        nextQuestionIndex,
        timePerQuestionInSeconds: room.timePerQuestion,
        totalQuestions: totalQuestions.length,
      }
    )
  },
})
