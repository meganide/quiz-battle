import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { ROOM_ERRORS } from "./errors"
import { generateUniqueInviteCode, leaveAllActiveRooms } from "./utils"
import { mutation } from "../_generated/server"
import { USER_ERRORS } from "../users/errors"

export const create = mutation({
  args: {
    name: v.string(),
    isPrivate: v.boolean(),
    topic: v.string(),
    numQuestions: v.number(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    timePerQuestion: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    if (args.timePerQuestion < 10 || args.timePerQuestion > 60) {
      throw ROOM_ERRORS.INVALID_TIME_PER_QUESTION
    }

    if (args.numQuestions < 1) {
      throw ROOM_ERRORS.INVALID_NUMBER_OF_QUESTIONS
    }

    await leaveAllActiveRooms(ctx, userId)

    const inviteCode = await generateUniqueInviteCode(ctx)

    await ctx.db.insert("rooms", {
      name: args.name,
      hostId: userId,
      isPrivate: args.isPrivate,
      topic: args.topic,
      numQuestions: args.numQuestions,
      difficulty: args.difficulty,
      timePerQuestion: args.timePerQuestion,
      status: "lobby",
      gamePlayerIds: [userId],
      inviteCode,
    })

    return {
      inviteCode,
    }
  },
})

export const join = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const room = await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .first()

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (room.status !== "lobby") {
      throw ROOM_ERRORS.ROOM_NOT_ACCEPTING_PLAYERS
    }

    if (room.gamePlayerIds.includes(userId)) {
      throw ROOM_ERRORS.ALREADY_IN_ROOM
    }

    await leaveAllActiveRooms(ctx, userId)

    await ctx.db.patch(room._id, {
      gamePlayerIds: [...room.gamePlayerIds, userId],
    })

    return room._id
  },
})

/**
 * This should only be called when the user leaves a room that is in lobby because we are updating the gamePlayerIds
 */
export const leave = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const room = await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .first()

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (!room.gamePlayerIds.includes(userId)) {
      throw ROOM_ERRORS.NOT_IN_ROOM
    }

    if (room.status !== "lobby") {
      throw ROOM_ERRORS.CANNOT_LEAVE_ROOM
    }

    const gamePlayerIds = room.gamePlayerIds.filter((id) => id !== userId)

    if (room.hostId === userId) {
      if (gamePlayerIds.length === 0) {
        await ctx.db.delete(room._id)
        return
      }

      const nextHost = gamePlayerIds[0]

      await ctx.db.patch(room._id, {
        hostId: nextHost,
        gamePlayerIds,
      })
      return
    }

    await ctx.db.patch(room._id, {
      gamePlayerIds,
    })
  },
})
