import { getAuthUserId } from "@convex-dev/auth/server"

import { USER_ERRORS } from "./errors"
import { query } from "../_generated/server"

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    return await ctx.db.get(userId)
  },
})
