import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
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

    // Validate timePerQuestion is between 10 and 60
    if (args.timePerQuestion < 10 || args.timePerQuestion > 60) {
      throw new Error("Time per question must be between 10 and 60 seconds");
    }

    // Validate numQuestions is positive
    if (args.numQuestions < 1) {
      throw new Error("Number of questions must be positive");
    }

    // Generate invite code for private rooms
    const inviteCode = args.isPrivate ? generateInviteCode() : undefined;

    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      hostId: userId,
      isPrivate: args.isPrivate,
      topic: args.topic,
      numQuestions: args.numQuestions,
      difficulty: args.difficulty,
      timePerQuestion: args.timePerQuestion,
      status: "waiting",
      playerIds: [userId],
      createdAt: Date.now(),
      inviteCode,
    });

    return {
      roomId,
      inviteCode,
    };
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.optional(v.id("rooms")),
    inviteCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let room: Doc<"rooms"> | null = null;
    if (args.roomId) {
      room = await ctx.db.get(args.roomId);
    } else if (args.inviteCode) {
      room = await ctx.db
        .query("rooms")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode))
        .first();
    }

    if (!room) {
      throw new Error("Room not found");
    }

    if (room.status !== "waiting") {
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
