/* eslint-disable import/no-default-export */
import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  ...authTables,
  rooms: defineTable({
    name: v.string(),
    hostId: v.id("users"),
    isPrivate: v.boolean(),
    topic: v.string(),
    numQuestions: v.number(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    timePerQuestion: v.number(),
    status: v.union(
      v.literal("lobby"),
      v.literal("active"),
      v.literal("completed")
    ),
    playerIds: v.array(v.id("users")),
    onlinePlayerIds: v.array(v.id("users")),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    inviteCode: v.string(),
  })
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_invite_code", ["inviteCode"]),
})
