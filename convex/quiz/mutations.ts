import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { QuizErrorCodes } from "./errors"
import { mutation } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"
import { USER_ERRORS } from "../users/errors"

export const startQuiz = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const { roomId } = args
    const room = await ctx.db.get(roomId)

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

    // 1. We need to create a new game state
    // 2. Create questions with langchain for all topics
    // 3. Insert questions into the database
    // 4. Create the game state object

    // const quiz = await ctx.db.patch(roomId, {
    //   status: "ongoing",
    //   startedAt: Date.now(),
    // })
  },
})
