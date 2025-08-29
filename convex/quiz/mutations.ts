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
          totalAnswered: 0,
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

    const firstQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", 0)
      )
      .first()

    await ctx.db.patch(gameStateId, {
      currentQuestionId: firstQuestion?._id,
      questionStartTime: Date.now(),
    })

    await ctx.db.patch(args.roomId, {
      status: "ongoing",
      startedAt: Date.now(),
      currentGameStateId: gameStateId,
    })

    await ctx.scheduler.runAfter(
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

    const currentQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    await ctx.db.patch(args.gameStateId, {
      currentQuestionId: currentQuestion._id,
      currentQuestionIndex: nextQuestionIndex,
      questionStartTime: Date.now(),
    })

    const isLastQuestion = nextQuestionIndex === totalQuestions
    if (isLastQuestion) {
      await ctx.db.patch(args.roomId, {
        status: "completed",
        completedAt: Date.now(),
      })

      return
    }

    await ctx.scheduler.runAfter(
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
  },
})

export const submitAnswer = mutation({
  args: {
    gameStateId: v.id("gameStates"),
    answerIndex: v.union(v.number(), v.null()), // null if no answer was selected
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

    const hasTimePassedForQuestion =
      gameState.questionStartTime &&
      gameState.questionStartTime + room.timePerQuestion * 1000 <
        Date.now() + 3000

    if (hasTimePassedForQuestion) {
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

    // Insert the player answer
    void ctx.db.insert("playerAnswers", {
      gameStateId,
      questionId: gameState.currentQuestionId,
      userId,
      answerIndex,
      answeredAt: Date.now(),
      isCorrect: isCorrectAnswer,
    })

    // Update player scores
    const playerScore = await ctx.db
      .query("playerScores")
      .withIndex("by_user_game", (q) =>
        q.eq("userId", userId).eq("gameStateId", gameStateId)
      )
      .first()

    if (playerScore) {
      const timeElapsed =
        Date.now() - (gameState.questionStartTime || Date.now())
      const maxTime = room.timePerQuestion * 1000
      const timeBonusMultiplier = Math.max(0, (maxTime - timeElapsed) / maxTime)

      // Calculate score: base points for correct answer + time bonus
      const basePoints = 100
      const timeBonus = Math.round(basePoints * timeBonusMultiplier * 0.5) // 50% bonus for speed
      const pointsEarned = isCorrectAnswer ? basePoints + timeBonus : 0

      await ctx.db.patch(playerScore._id, {
        score: playerScore.score + pointsEarned,
        correctAnswers: playerScore.correctAnswers + (isCorrectAnswer ? 1 : 0),
        totalAnswered: playerScore.totalAnswered + 1,
        updatedAt: Date.now(),
      })
    }
  },
})
