import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";

export const getMyRooms = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("rooms")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .order("desc")
      .collect();
  },
});

export const getPublicRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPrivate"), false),
          q.eq(q.field("status"), "waiting"),
        ),
      )
      .order("desc")
      .collect();
  },
});
