import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { query } from "../_generated/server"
import { USER_ERRORS } from "../users/errors"

export const getPublicRooms = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    return await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPrivate"), false),
          q.eq(q.field("status"), "lobby")
        )
      )
      .order("desc")
      .collect()
  },
})

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
