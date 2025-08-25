import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { sortRoomsByCreationDate } from "./utils"
import { query } from "../_generated/server"
import { USER_ERRORS } from "../users/errors"

export const getByInviteCode = query({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .unique()
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const [publicRooms, myPrivateRooms] = await Promise.all([
      ctx.db
        .query("rooms")
        .filter((q) =>
          q.and(
            q.eq(q.field("isPrivate"), false),
            q.eq(q.field("status"), "lobby")
          )
        )
        .collect(),
      ctx.db
        .query("rooms")
        .filter((q) =>
          q.and(
            q.eq(q.field("isPrivate"), true),
            q.eq(q.field("hostId"), userId),
            q.eq(q.field("status"), "lobby")
          )
        )
        .collect(),
    ])

    const allRooms = [...publicRooms, ...myPrivateRooms]

    const sortedRooms = sortRoomsByCreationDate(allRooms, userId)

    return {
      rooms: sortedRooms,
      numberOfActiveRooms: publicRooms.length,
    }
  },
})

export const getCurrentRoom = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    const rooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("status"), "lobby"))
      .collect()

    const userRoom = rooms.find((room) => room.gamePlayerIds.includes(userId))

    return userRoom || null
  },
})
