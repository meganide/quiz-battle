import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { mutation } from "../_generated/server"
import { USER_ERRORS } from "../users/errors"

export const sendMessage = mutation({
  args: {
    message: v.string(),
    chatRoomId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw USER_ERRORS.NOT_AUTHENTICATED
    }

    await ctx.db.insert("chatMessages", {
      content: args.message,
      chatRoomId: args.chatRoomId,
      userId,
    })
  },
})
