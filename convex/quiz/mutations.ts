import { v } from "convex/values"

import { internalMutation } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"

export const saveQuestions = internalMutation({
  args: {
    roomId: v.id("rooms"),
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()),
        correctAnswerIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId)

    if (!room) {
      throw ROOM_ERRORS.ROOM_NOT_FOUND
    }

    const gameStateId = await ctx.db.insert("gameStates", {
      roomId: args.roomId,
      phase: "question",
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
      questionStartTime: Date.now(),
    })

    await Promise.all([
      room.gamePlayerIds.map((playerId) =>
        ctx.db.insert("playerScores", {
          gameStateId: gameStateId,
          userId: playerId,
          score: 0,
          correctAnswers: 0,
          totalAnswered: 0,
          updatedAt: Date.now(),
        })
      ),
      args.questions.map(async (question, index) => {
        await ctx.db.insert("questions", {
          gameStateId: gameStateId,
          answers: question.answers,
          correctAnswerIndex: question.correctAnswerIndex,
          questionIndex: index,
          question: question.question,
        })
      }),
    ])

    const firstQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", 0)
      )
      .first()

    await ctx.db.patch(gameStateId, {
      currentQuestionId: firstQuestion?._id,
    })

    await ctx.db.patch(args.roomId, {
      status: "ongoing",
      startedAt: Date.now(),
      currentGameStateId: gameStateId,
    })
  },
})
