import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"
import { USER_ERRORS } from "../users/errors"

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
    })

    await ctx.db.patch(args.roomId, {
      status: "ongoing",
      startedAt: Date.now(),
      currentGameStateId: gameStateId,
    })
  },
})

export const submitAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    answerIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const question = await ctx.db.get(args.questionId)

    if (!question) {
      throw new Error("Question not found")
    }

    // Check if user already answered this question
    const existingAnswer = await ctx.db
      .query("playerAnswers")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionId", args.questionId)
      )
      .first()

    if (existingAnswer) {
      throw new Error("Answer already submitted for this question")
    }

    // Validate answer index
    if (args.answerIndex < 0 || args.answerIndex > 3) {
      throw new Error("Invalid answer index")
    }

    const isCorrect = args.answerIndex === question.correctAnswerIndex
    const answeredAt = Date.now()

    // Record the answer
    await ctx.db.insert("playerAnswers", {
      gameStateId: question.gameStateId,
      questionId: args.questionId,
      userId: userId,
      answerIndex: args.answerIndex,
      answeredAt: answeredAt,
      isCorrect: isCorrect,
    })

    // Update player score
    const playerScore = await ctx.db
      .query("playerScores")
      .withIndex("by_user_game", (q) =>
        q.eq("userId", userId).eq("gameStateId", question.gameStateId)
      )
      .first()

    let points = 0

    if (playerScore) {
      const gameState = await ctx.db.get(question.gameStateId)

      if (isCorrect && gameState?.questionStartTime) {
        // Calculate points based on speed (max 1000 points, minimum 100 for correct answers)
        const timeElapsed = answeredAt - gameState.questionStartTime
        const room = await ctx.db.get(gameState.roomId)
        const timeLimit = (room?.timePerQuestion || 30) * 1000 // Convert to milliseconds

        // Points decrease linearly from 1000 to 100 based on time taken
        const speedBonus = Math.max(100, 1000 - (timeElapsed / timeLimit) * 900)
        points = Math.round(speedBonus)
      }

      await ctx.db.patch(playerScore._id, {
        score: playerScore.score + points,
        correctAnswers: playerScore.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswered: playerScore.totalAnswered + 1,
        updatedAt: Date.now(),
      })
    }

    return {
      isCorrect,
      points,
    }
  },
})

export const advanceToNextQuestion = internalMutation({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw new Error("Game state not found")
    }

    const room = await ctx.db.get(gameState.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const nextQuestionIndex = gameState.currentQuestionIndex + 1

    // Check if this was the last question
    if (nextQuestionIndex >= room.numQuestions) {
      // Game is finished
      await ctx.db.patch(args.gameStateId, {
        phase: "finished",
        updatedAt: Date.now(),
      })

      await ctx.db.patch(room._id, {
        status: "completed",
        completedAt: Date.now(),
      })

      return { gameFinished: true }
    }

    // Get the next question
    const nextQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q
          .eq("gameStateId", args.gameStateId)
          .eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!nextQuestion) {
      throw new Error("Next question not found")
    }

    // Update game state to next question
    await ctx.db.patch(args.gameStateId, {
      currentQuestionIndex: nextQuestionIndex,
      currentQuestionId: nextQuestion._id,
      phase: "question",
      questionStartTime: Date.now(),
      updatedAt: Date.now(),
    })

    return { gameFinished: false }
  },
})

export const advanceFromResults = internalMutation({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState || gameState.phase !== "results") {
      return { gameFinished: false }
    }

    // Manually implement the advancement logic
    const room = await ctx.db.get(gameState.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const nextQuestionIndex = gameState.currentQuestionIndex + 1

    // Check if this was the last question
    if (nextQuestionIndex >= room.numQuestions) {
      // Game is finished
      await ctx.db.patch(args.gameStateId, {
        phase: "finished",
        updatedAt: Date.now(),
      })

      await ctx.db.patch(room._id, {
        status: "completed",
        completedAt: Date.now(),
      })

      return { gameFinished: true }
    }

    // Get the next question
    const nextQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q
          .eq("gameStateId", args.gameStateId)
          .eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!nextQuestion) {
      throw new Error("Next question not found")
    }

    // Update game state to next question
    await ctx.db.patch(args.gameStateId, {
      currentQuestionIndex: nextQuestionIndex,
      currentQuestionId: nextQuestion._id,
      phase: "question",
      questionStartTime: Date.now(),
      updatedAt: Date.now(),
    })

    return { gameFinished: false }
  },
})

export const showResults = internalMutation({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameStateId, {
      phase: "results",
      updatedAt: Date.now(),
    })
  },
})

export const checkExpiredQuestions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()

    // Find all active game states in question phase
    const activeGameStates = await ctx.db
      .query("gameStates")
      .withIndex("by_phase", (q) => q.eq("phase", "question"))
      .collect()

    for (const gameState of activeGameStates) {
      if (!gameState.questionStartTime) continue

      // Get room to check time per question
      const room = await ctx.db.get(gameState.roomId)
      if (!room) continue

      const timeLimit = room.timePerQuestion * 1000 // Convert to milliseconds
      const elapsed = now - gameState.questionStartTime

      // Check if time has expired
      if (elapsed >= timeLimit) {
        // Add null answers for players who haven't answered
        await addMissingAnswers(ctx, gameState, room)

        // Move to results phase
        await ctx.db.patch(gameState._id, {
          phase: "results",
          updatedAt: now,
        })

        // Schedule progression to next question after 3 seconds
        await ctx.scheduler.runAfter(
          3000,
          internal.quiz.mutations.advanceFromResults,
          {
            gameStateId: gameState._id,
          }
        )
      } else {
        // Check if all players have answered (early completion)
        const currentQuestion = gameState.currentQuestionId
        if (!currentQuestion) continue

        const allAnswers = await ctx.db
          .query("playerAnswers")
          .withIndex("by_question", (q) => q.eq("questionId", currentQuestion))
          .collect()

        if (allAnswers.length >= room.gamePlayerIds.length) {
          // All players answered - advance early
          await ctx.db.patch(gameState._id, {
            phase: "results",
            updatedAt: now,
          })

          // Schedule progression to next question after 3 seconds
          await ctx.scheduler.runAfter(
            3000,
            internal.quiz.mutations.advanceFromResults,
            {
              gameStateId: gameState._id,
            }
          )
        }
      }
    }
  },
})

// Helper function to add null answers for players who haven't answered
async function addMissingAnswers(ctx: any, gameState: any, room: any) {
  if (!gameState.currentQuestionId) return

  // Get existing answers
  const existingAnswers = await ctx.db
    .query("playerAnswers")
    .withIndex("by_question", (q: any) =>
      q.eq("questionId", gameState.currentQuestionId)
    )
    .collect()

  const answeredPlayerIds = new Set(existingAnswers.map((a: any) => a.userId))

  // Add null answers for players who haven't answered
  for (const playerId of room.gamePlayerIds) {
    if (!answeredPlayerIds.has(playerId)) {
      await ctx.db.insert("playerAnswers", {
        gameStateId: gameState._id,
        questionId: gameState.currentQuestionId,
        userId: playerId,
        answerIndex: -1, // Use -1 to indicate no answer
        answeredAt: Date.now(),
        isCorrect: false,
      })

      // Update player score (no points for no answer)
      const playerScore = await ctx.db
        .query("playerScores")
        .withIndex("by_user_game", (q: any) =>
          q.eq("userId", playerId).eq("gameStateId", gameState._id)
        )
        .first()

      if (playerScore) {
        await ctx.db.patch(playerScore._id, {
          totalAnswered: playerScore.totalAnswered + 1,
          updatedAt: Date.now(),
        })
      }
    }
  }
}
