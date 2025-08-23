import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { ROOM_ERRORS } from "./errors"
import { generateInviteCode } from "./utils"
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

    const activeRooms = await ctx.db
      .query("rooms")
      .withIndex(
        "by_status",
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (q) => q.eq("status", "active") || q.eq("status", "lobby")
      )
      .collect()

    const joinedRooms = activeRooms.filter((room) =>
      room.onlinePlayerIds.includes(userId)
    )

    await Promise.all(
      joinedRooms.map(async (room) => {
        const onlinePlayerIds = room.onlinePlayerIds.filter(
          (id) => id !== userId
        )

        if (onlinePlayerIds.length === 0) {
          await ctx.db.delete(room._id)
          return
        }

        if (room.hostId === userId) {
          await ctx.db.patch(room._id, {
            hostId: onlinePlayerIds[0],
            onlinePlayerIds,
          })
          return
        }

        await ctx.db.patch(room._id, {
          onlinePlayerIds,
        })
      })
    )

    let inviteCode = generateInviteCode()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
    while (true) {
      const existingRoom = await ctx.db
        .query("rooms")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .first()

      if (!existingRoom) {
        break
      }

      inviteCode = generateInviteCode()
    }

    await ctx.db.insert("rooms", {
      name: args.name,
      hostId: userId,
      isPrivate: args.isPrivate,
      topic: args.topic,
      numQuestions: args.numQuestions,
      difficulty: args.difficulty,
      timePerQuestion: args.timePerQuestion,
      status: "lobby",
      playerIds: [userId],
      onlinePlayerIds: [userId],
      createdAt: Date.now(),
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

    if (room.playerIds.includes(userId)) {
      throw ROOM_ERRORS.ALREADY_IN_ROOM
    }

    await ctx.db.patch(room._id, {
      playerIds: [...room.playerIds, userId],
      onlinePlayerIds: [...room.onlinePlayerIds, userId],
    })

    return room._id
  },
})

export const leave = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const room = await ctx.db.get(args.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    if (!room.playerIds.includes(userId)) {
      throw ROOM_ERRORS.NOT_IN_ROOM
    }

    const onlinePlayerIds = room.onlinePlayerIds.filter((id) => id !== userId)

    if (room.hostId === userId) {
      if (onlinePlayerIds.length === 0) {
        await ctx.db.delete(room._id)
        return
      }

      const nextHost = onlinePlayerIds[0]

      await ctx.db.patch(room._id, {
        hostId: nextHost,
        onlinePlayerIds,
      })
      return
    }

    await ctx.db.patch(room._id, {
      onlinePlayerIds,
    })
  },
})
