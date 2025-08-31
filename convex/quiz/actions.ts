import { v } from "convex/values"

import { QUIZ_ERRORS } from "./errors"
import { generateQuizQuestions } from "./utils"
import { api, internal } from "../_generated/api"
import { internalAction } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"

export const generateAiQuestions = internalAction({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const { roomId } = args

    const room = await ctx.runQuery(api.rooms.queries.getById, { roomId })
    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (!room.currentGameStateId) {
      throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
    }

    const aiQuestions = await generateQuizQuestions(
      room.topics,
      room.numQuestions,
      room.difficulty
    )

    await ctx.runMutation(internal.quiz.mutations.saveQuestions, {
      gameStateId: room.currentGameStateId,
      questions: aiQuestions,
    })

    await ctx.scheduler.runAfter(0, internal.quiz.mutations.questionPhase, {
      roomId,
      gameStateId: room.currentGameStateId,
    })
  },
})

export const finishQuiz = internalAction({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const { roomId } = args

    await ctx.runMutation(internal.rooms.mutations.updateStatus, {
      roomId,
      status: "completed",
    })
  },
})
