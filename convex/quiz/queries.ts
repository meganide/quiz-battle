import { v } from "convex/values"

import { QUIZ_ERRORS } from "./errors"
import { query } from "../_generated/server"

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
      gameState,
      currentQuestion,
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
