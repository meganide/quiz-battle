import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { QuizErrorCodes } from "./errors"
import { generateQuizQuestions } from "./utils"
import { api, internal } from "../_generated/api"
import { action } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"
import { USER_ERRORS } from "../users/errors"

export const startQuiz = action({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const { roomId } = args

    const room = await ctx.runQuery(api.rooms.queries.getById, { roomId })

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (room.status !== "lobby") {
      throw ROOM_ERRORS.ROOM_HAS_ALREADY_STARTED
    }

    const isHost = userId === room.hostId

    if (!isHost) {
      throw QuizErrorCodes.NOT_HOST
    }

    if (!room.gamePlayerIds.includes(userId)) {
      throw ROOM_ERRORS.NOT_IN_ROOM
    }

    const aiQuestions = await generateQuizQuestions(
      room.topic,
      room.numQuestions,
      room.difficulty
    )

    await ctx.runMutation(internal.quiz.mutations.startQuiz, {
      roomId,
      questions: aiQuestions,
    })

    return { success: true }
  },
})

// Keep this action for potential manual overrides, but game progression is now automatic
export const handleQuestionTimeout = action({
  args: {
    gameStateId: v.id("gameStates"),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean
    gameFinished?: boolean
    message?: string
  }> => {
    // This is now handled automatically by cron jobs
    // But kept for backward compatibility or manual triggers
    await ctx.runMutation(internal.quiz.mutations.showResults, {
      gameStateId: args.gameStateId,
    })

    await new Promise((resolve) => {
      setTimeout(resolve, 3000)
    })

    const result = await ctx.runMutation(
      internal.quiz.mutations.advanceToNextQuestion,
      {
        gameStateId: args.gameStateId,
      }
    )

    return { success: true, gameFinished: result.gameFinished }
  },
})
