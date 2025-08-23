import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const getPublicRooms = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPrivate"), false),
          q.eq(q.field("status"), "lobby"),
          q.neq(q.field("hostId"), userId),
        ),
      )
      .order("desc")
      .collect();
  },
});
