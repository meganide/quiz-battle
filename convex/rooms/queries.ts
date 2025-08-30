import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { sortRoomsByCreationDate } from "./utils"
import { query } from "../_generated/server"

export const getByInviteCode = query({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .unique()

    if (!room) {
      return null
    }

    return room
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    const rooms = await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("status"), "lobby"),
            q.eq(q.field("status"), "ongoing")
          )
        )
      )
      .collect()

    const sortedRooms = sortRoomsByCreationDate(rooms, userId)

    const numberOfActiveRooms = rooms.filter(
      (room) => room.isPrivate === false
    ).length

    return {
      rooms: sortedRooms,
      numberOfActiveRooms,
    }
  },
})

export const getCurrentRoom = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const rooms = await ctx.db
      .query("rooms")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "lobby"),
          q.eq(q.field("status"), "ongoing")
        )
      )
      .collect()

    const userRoom = rooms.find((room) => room.gamePlayerIds.includes(userId))

    return userRoom || null
  },
})

export const getById = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)
    return room
  },
})
