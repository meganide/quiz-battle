import { getAuthUserId } from "@convex-dev/auth/server"

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
          q.eq(q.field("status"), "lobby"),
          q.neq(q.field("hostId"), userId)
        )
      )
      .order("desc")
      .collect()
  },
})
