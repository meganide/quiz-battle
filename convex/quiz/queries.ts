import { v } from "convex/values"

import { QUIZ_ERRORS } from "./errors"
import { internalQuery, query } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"

export const getGameState = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db
      .query("gameStates")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first()

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    return gameState
  },
})

export const getCurrentQuestion = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    const currentQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q
          .eq("gameStateId", gameState._id)
          .eq("questionIndex", gameState.currentQuestionIndex)
      )
      .first()

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    return {
      question: currentQuestion.question,
      id: currentQuestion._id,
      index: currentQuestion.questionIndex,
    }
  },
})

export const getQuestionAnswers = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    if (gameState.phase !== "answering" && gameState.phase !== "score") {
      // During other phases, no answers should be shown
      return []
    }

    const currentQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q
          .eq("gameStateId", gameState._id)
          .eq("questionIndex", gameState.currentQuestionIndex)
      )
      .first()

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    return currentQuestion.answers
  },
})

export const getQuestionCorrectAnswerIndex = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    if (gameState.phase !== "score") {
      // Correct answer is only revealed during score phase
      return null
    }

    const currentQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q
          .eq("gameStateId", gameState._id)
          .eq("questionIndex", gameState.currentQuestionIndex)
      )
      .first()

    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    return currentQuestion.correctAnswerIndex
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

    const playerScoresWithUserInfo = await Promise.all(
      playerScores.map(async (playerScore) => {
        const user = await ctx.db.get(playerScore.userId)
        return {
          ...playerScore,
          user: {
            name: user?.name,
            image: user?.image,
          },
        }
      })
    )

    const sortedPlayerScoresDescending = playerScoresWithUserInfo.sort(
      (a, b) => b.score - a.score
    )

    return sortedPlayerScoresDescending
  },
})

export const getPlayerAnswersForQuestion = query({
  args: {
    questionId: v.id("questions"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    if (gameState.phase === "question") {
      // During question phase, no answers are available yet
      return []
    }

    const playerAnswers = await ctx.db
      .query("playerAnswers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect()

    const answersWithUserInfo = await Promise.all(
      playerAnswers.map(async (answer) => {
        const user = await ctx.db.get(answer.userId)
        return {
          ...answer,
          user: {
            name: user?.name,
            image: user?.image,
          },
        }
      })
    )

    return answersWithUserInfo
  },
})

export const getSubmittedUserIds = query({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    if (!gameState.currentQuestionId) {
      return []
    }

    // Get all answers for the current question
    const playerAnswers = await ctx.db
      .query("playerAnswers")
      .withIndex("by_question", (q) =>
        q.eq("questionId", gameState.currentQuestionId!)
      )
      .collect()

    // Create a map of who has submitted
    const submittedUserIds = new Set(
      playerAnswers.map((answer) => answer.userId)
    )

    const submissionStatus = Array.from(submittedUserIds)

    return submissionStatus
  },
})

export const isLastQuestion = internalQuery({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const gameState = await ctx.db.get(args.gameStateId)

    if (!gameState) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    const room = await ctx.db.get(args.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    return gameState.currentQuestionIndex === room.numQuestions - 1
  },
})
