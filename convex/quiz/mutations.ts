import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { TIMERS_MILLISECONDS } from "./constants"
import { QUIZ_ERRORS } from "./errors"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import { ROOM_ERRORS, RoomErrorCodes } from "../rooms/errors"
import { USER_ERRORS, UserErrorCodes } from "../users/errors"

export const startQuiz = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const { roomId } = args

    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const room = await ctx.db.get(roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (room.status !== "lobby") {
      throw ROOM_ERRORS.ROOM_HAS_ALREADY_STARTED
    }

    const isHost = userId === room.hostId

    if (!isHost) {
      throw ROOM_ERRORS.NOT_HOST
    }

    if (!room.gamePlayerIds.includes(userId)) {
      throw ROOM_ERRORS.NOT_IN_ROOM
    }

    const gameStateId = await ctx.db.insert("gameStates", {
      roomId,
      phase: "starting",
      updatedAt: Date.now(),
      currentQuestionIndex: -1, // We start at -1 because we don't have any questions yet
    })

    await Promise.all([
      room.gamePlayerIds.map((playerId) =>
        ctx.db.insert("playerScores", {
          gameStateId,
          userId: playerId,
          score: 0,
          correctAnswers: 0,
          updatedAt: Date.now(),
        })
      ),
      ctx.db.patch(roomId, {
        currentGameStateId: gameStateId,
        startedAt: Date.now(),
        status: "ongoing",
      }),
    ])

    await ctx.scheduler.runAfter(0, internal.quiz.actions.generateAiQuestions, {
      roomId,
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

    const hasUserJoinedRoom = room.gamePlayerIds.includes(userId)

    if (!hasUserJoinedRoom) {
      throw ROOM_ERRORS.NOT_IN_ROOM
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

    const existingAnswer = await ctx.db
      .query("playerAnswers")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionId", gameState.currentQuestionId!)
      )
      .first()

    if (existingAnswer) {
      await ctx.db.patch(existingAnswer._id, {
        answerIndex,
        answeredAt: Date.now(),
        isCorrect: isCorrectAnswer,
      })
    } else {
      await ctx.db.insert("playerAnswers", {
        gameStateId,
        questionId: gameState.currentQuestionId,
        userId,
        answerIndex,
        answeredAt: Date.now(),
        isCorrect: isCorrectAnswer,
      })
    }

    const allPlayerAnswers = await ctx.db
      .query("playerAnswers")
      .withIndex("by_question", (q) =>
        q.eq("questionId", gameState.currentQuestionId!)
      )
      .collect()

    const totalPlayers = room.gamePlayerIds.length
    const playersWhoAnswered = new Set(
      allPlayerAnswers.map((answer) => answer.userId)
    )

    const allPlayersAnswered = playersWhoAnswered.size === totalPlayers

    if (!allPlayersAnswered) {
      return
    }

    if (!gameState.scheduledFunctionId) {
      return
    }

    const scheduledFunction = await ctx.db.system.get(
      gameState.scheduledFunctionId
    )

    if (!scheduledFunction) {
      return
    }

    await ctx.scheduler.cancel(scheduledFunction._id)

    await ctx.scheduler.runAfter(0, internal.quiz.mutations.scorePhase, {
      roomId: room._id,
      gameStateId,
    })
  },
})

export const questionPhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const gameState = await ctx.db.get(gameStateId)

    if (!gameState) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const nextQuestionIndex = gameState.currentQuestionIndex! + 1

    const nextQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!nextQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    await ctx.db.patch(gameStateId, {
      phase: "question",
      questionStartTime: Date.now(),
      currentQuestionId: nextQuestion._id,
      currentQuestionIndex: nextQuestionIndex,
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(
      TIMERS_MILLISECONDS.QUESTION_PHASE,
      internal.quiz.mutations.answerPhase,
      {
        roomId,
        gameStateId,
      }
    )
  },
})

export const answerPhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const room = await ctx.db.get(roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const scheduledId = await ctx.scheduler.runAfter(
      room.timePerQuestion * 1000,
      internal.quiz.mutations.scorePhase,
      {
        roomId,
        gameStateId,
      }
    )

    await ctx.db.patch(gameStateId, {
      scheduledFunctionId: scheduledId,
      answeringStartTime: Date.now(),
      updatedAt: Date.now(),
      phase: "answering",
    })
  },
})

export const scorePhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    if (!gameState.currentQuestionId) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    const room = await ctx.db.get(args.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    await Promise.all(
      room.gamePlayerIds.map(async (playerId) => {
        // Get player's answer for the previous question
        const playerAnswer = await ctx.db
          .query("playerAnswers")
          .withIndex("by_user_question", (q) =>
            q
              .eq("userId", playerId)
              .eq("questionId", gameState.currentQuestionId!)
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
            q.eq("userId", playerId).eq("gameStateId", gameState._id)
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

    await ctx.db.patch(gameStateId, {
      phase: "score",
      scoreStartTime: Date.now(),
      updatedAt: Date.now(),
    })

    const isLastQuestion =
      gameState.currentQuestionIndex === room.numQuestions - 1

    if (isLastQuestion) {
      await ctx.scheduler.runAfter(
        TIMERS_MILLISECONDS.SCORE_PHASE,
        internal.quiz.actions.finishQuiz,
        {
          roomId,
        }
      )

      return
    }

    await ctx.scheduler.runAfter(
      TIMERS_MILLISECONDS.SCORE_PHASE,
      internal.quiz.mutations.questionPhase,
      {
        roomId,
        gameStateId,
      }
    )
  },
})

export const saveQuestions = internalMutation({
  args: {
    gameStateId: v.id("gameStates"),
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()),
        correctAnswerIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { gameStateId, questions } = args

    await Promise.all([
      questions.map(async (question, index) => {
        await ctx.db.insert("questions", {
          gameStateId: gameStateId,
          answers: question.answers,
          correctAnswerIndex: question.correctAnswerIndex,
          questionIndex: index,
          question: question.question,
        })
      }),
    ])
  },
})
