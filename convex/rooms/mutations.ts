import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ErrorWithCode } from "../error";
import { ROOM_ERRORS } from "./errors";
import { generateInviteCode } from "./utils";

export const create = mutation({
  args: {
    name: v.string(),
    isPrivate: v.boolean(),
    topic: v.string(),
    numQuestions: v.number(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
    ),
    timePerQuestion: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has an active room
    const existingActiveRoom = await ctx.db
      .query("rooms")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.neq(q.field("status"), "completed"))
      .first();

    if (existingActiveRoom) {
      throw ROOM_ERRORS.ACTIVE_ROOM_EXISTS;
    }

    // Validate timePerQuestion is between 10 and 60
    if (args.timePerQuestion < 10 || args.timePerQuestion > 60) {
      throw new Error("Time per question must be between 10 and 60 seconds");
    }

    // Validate numQuestions is positive
    if (args.numQuestions < 1) {
      throw new Error("Number of questions must be positive");
    }

    let inviteCode = generateInviteCode();

    while (true) {
      const existingRoom = await ctx.db
        .query("rooms")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .first();

      if (!existingRoom) {
        break;
      }

      inviteCode = generateInviteCode();
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
      createdAt: Date.now(),
      inviteCode,
    });

    return {
      inviteCode,
    };
  },
});

export const joinLobby = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const room = await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
      .first();

    if (!room) {
      throw new Error("Room not found");
    }

    if (room.status !== "lobby") {
      throw new Error("Room is not accepting new players");
    }

    if (room.playerIds.includes(userId)) {
      throw new Error("Already in this room");
    }

    await ctx.db.patch(room._id, {
      playerIds: [...room.playerIds, userId],
    });

    return room._id;
  },
});
