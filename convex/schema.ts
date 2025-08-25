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
      v.literal("ongoing"),
      v.literal("completed")
    ),
    gamePlayerIds: v.array(v.id("users")), // Players participating in the game
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    inviteCode: v.string(),
    currentGameStateId: v.optional(v.id("gameStates")),
  })
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_invite_code", ["inviteCode"])
    .index("by_game_player", ["gamePlayerIds"]),

  questions: defineTable({
    gameStateId: v.id("gameStates"),
    questionIndex: v.number(), // 0, 1, 2, etc.
    question: v.string(),
    answers: v.array(v.string()),
    correctAnswerIndex: v.number(),
    topic: v.string(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    createdAt: v.number(),
  })
    .index("by_game_state", ["gameStateId"])
    .index("by_game_and_index", ["gameStateId", "questionIndex"]),

  gameStates: defineTable({
    roomId: v.id("rooms"),
    currentQuestionIndex: v.number(),
    currentQuestionId: v.optional(v.id("questions")),
    phase: v.union(
      v.literal("waiting"),
      v.literal("question"),
      v.literal("results"),
      v.literal("finished")
    ),
    questionStartTime: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_phase", ["phase"]),

  playerScores: defineTable({
    gameStateId: v.id("gameStates"),
    userId: v.id("users"),
    score: v.number(),
    correctAnswers: v.number(),
    totalAnswered: v.number(),
    updatedAt: v.number(),
  })
    .index("by_game_state", ["gameStateId"])
    .index("by_user_game", ["userId", "gameStateId"]),

  playerAnswers: defineTable({
    gameStateId: v.id("gameStates"),
    questionId: v.id("questions"),
    userId: v.id("users"),
    answerIndex: v.number(),
    answeredAt: v.number(),
    isCorrect: v.boolean(),
  })
    .index("by_game_state", ["gameStateId"])
    .index("by_question", ["questionId"])
    .index("by_user_question", ["userId", "questionId"]),

  chatRooms: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  chatMessages: defineTable({
    content: v.string(),
    userId: v.id("users"),
    chatRoomId: v.id("chatRooms"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isEdited: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_chat_room", ["chatRoomId"])
    .index("by_user", ["userId"])
    .index("by_room_created", ["chatRoomId", "createdAt"]),
})
