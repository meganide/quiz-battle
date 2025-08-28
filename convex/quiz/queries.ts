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
