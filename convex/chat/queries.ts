import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { query } from "../_generated/server"

export const getMessages = query({
  args: {
    chatRoomId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    const messages = await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("chatRoomId"), args.chatRoomId))
      .order("asc")
      .take(20)

    const messagesWithUser = await Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.userId)
        return {
          ...message,
          author: {
            name: author?.name,
            image: author?.image,
          },
          isOwnMessage: author?._id === userId,
        }
      })
    )

    const sortedMessagesAscending = messagesWithUser.sort(
      (a, b) => a._creationTime - b._creationTime
    )

    return sortedMessagesAscending
  },
})
