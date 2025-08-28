import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { query } from "../_generated/server"

export const getGameState = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)

    if (!room || !room.currentGameStateId) {
      return null
    }

    const gameState = await ctx.db.get(room.currentGameStateId)
    return gameState
  },
})

export const getCurrentQuestion = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState || !gameState.currentQuestionId) {
      return null
    }

    const question = await ctx.db.get(gameState.currentQuestionId)

    if (!question) {
      return null
    }

    // Don't return the correct answer index to the client during the game
    return {
      _id: question._id,
      question: question.question,
      answers: question.answers,
      questionIndex: question.questionIndex,
    }
  },
})

export const getPlayerScores = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const playerScores = await ctx.db
      .query("playerScores")
      .withIndex("by_game_state", (q) => q.eq("gameStateId", args.gameStateId))
      .collect()

    // Get user details for each player
    const playersWithDetails = await Promise.all(
      playerScores.map(async (score) => {
        const user = await ctx.db.get(score.userId)
        return {
          ...score,
          name: user?.name || "Anonymous Player",
          image: user?.image,
        }
      })
    )

    // Sort by score descending, then by correct answers
    return playersWithDetails.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score
      }
      return b.correctAnswers - a.correctAnswers
    })
  },
})

export const getUserAnswer = query({
  args: {
    questionId: v.id("questions"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || (await getAuthUserId(ctx))

    if (!userId) {
      return null
    }

    const answer = await ctx.db
      .query("playerAnswers")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", userId).eq("questionId", args.questionId)
      )
      .first()

    // If answer has answerIndex -1, it means they didn't answer
    if (answer && answer.answerIndex === -1) {
      return {
        ...answer,
        answerIndex: null, // Return null to frontend for "no answer"
      }
    }

    return answer
  },
})

export const getQuestionResults = query({
  args: {
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId)

    if (!question) {
      return null
    }

    const answers = await ctx.db
      .query("playerAnswers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect()

    // Get user details for each answer
    const answersWithDetails = await Promise.all(
      answers.map(async (answer) => {
        const user = await ctx.db.get(answer.userId)
        return {
          ...answer,
          name: user?.name || "Anonymous Player",
          image: user?.image,
        }
      })
    )

    // Calculate answer distribution (including no answers as index -1)
    const answerDistribution = [0, 0, 0, 0, 0] // [A, B, C, D, No Answer]
    answersWithDetails.forEach((answer) => {
      if (answer.answerIndex === -1) {
        answerDistribution[4]++ // No answer
      } else {
        answerDistribution[answer.answerIndex]++
      }
    })

    return {
      question: {
        _id: question._id,
        question: question.question,
        answers: question.answers,
        correctAnswerIndex: question.correctAnswerIndex,
      },
      answers: answersWithDetails.sort((a, b) => a.answeredAt - b.answeredAt),
      answerDistribution,
      totalAnswers: answersWithDetails.length,
    }
  },
})

export const getGameProgress = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)

    if (!room || !room.currentGameStateId) {
      return null
    }

    const gameState = await ctx.db.get(room.currentGameStateId)

    if (!gameState) {
      return null
    }

    return {
      currentQuestionIndex: gameState.currentQuestionIndex,
      totalQuestions: room.numQuestions,
      phase: gameState.phase,
      timePerQuestion: room.timePerQuestion,
      questionStartTime: gameState.questionStartTime,
    }
  },
})
