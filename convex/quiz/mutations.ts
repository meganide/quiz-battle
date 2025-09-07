import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import type { Doc, Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"

import { TIMERS_MILLISECONDS } from "./constants"
import { QUIZ_ERRORS } from "./errors"
import { internal } from "../_generated/api"
import { internalMutation, mutation } from "../_generated/server"
import { ROOM_ERRORS } from "../rooms/errors"
import { USER_ERRORS } from "../users/errors"

// Constants
const GRACE_PERIOD_MILLISECONDS = 3 * 1000
const BASE_POINTS = 100
const TIME_BONUS_MULTIPLIER = 0.5

export const startQuiz = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const { roomId } = args

    const userId = await validateUserAuthentication(ctx)
    const room = await validateRoomExists(ctx, roomId)

    validateRoomInLobbyState(room)
    validateUserIsHost(userId, room)
    validateUserInRoom(userId, room)

    const gameStateId = await createGameState(ctx, roomId)

    await Promise.all([
      initializePlayerScores(ctx, gameStateId, room.gamePlayerIds),
      updateRoomToOngoing(ctx, roomId, gameStateId),
    ])

    await ctx.scheduler.runAfter(0, internal.quiz.actions.generateAiQuestions, {
      roomId,
    })
  },
})

export const submitAnswer = mutation({
  args: {
    gameStateId: v.id("gameStates"),
    answerIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const { gameStateId, answerIndex } = args

    const userId = await validateUserAuthentication(ctx)
    const gameState = await validateGameStateExists(ctx, gameStateId)
    const room = await validateRoomExists(ctx, gameState.roomId)

    validateUserInRoom(userId, room)
    validateQuestionTimeNotExpired(gameState, room)

    if (!gameState.currentQuestionId) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    const currentQuestion = await ctx.db.get(gameState.currentQuestionId)
    if (!currentQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    const isCorrectAnswer = answerIndex === currentQuestion.correctAnswerIndex
    await getOrCreatePlayerAnswer(ctx, {
      gameStateId,
      questionId: gameState.currentQuestionId,
      userId,
      answerIndex,
      isCorrect: isCorrectAnswer,
    })

    const allPlayersAnswered = await checkAllPlayersAnswered(
      ctx,
      gameState.currentQuestionId,
      room.gamePlayerIds.length
    )

    if (!allPlayersAnswered) {
      return
    }

    if (gameState.scheduledFunctionId) {
      await cancelScheduledFunction(ctx, gameState.scheduledFunctionId)
    }

    await ctx.scheduler.runAfter(0, internal.quiz.mutations.scorePhase, {
      roomId: room._id,
      gameStateId,
    })
  },
})

export const questionPhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const gameState = await validateGameStateExists(ctx, gameStateId)
    const nextQuestionIndex = gameState.currentQuestionIndex + 1

    const nextQuestion = await ctx.db
      .query("questions")
      .withIndex("by_game_and_index", (q) =>
        q.eq("gameStateId", gameStateId).eq("questionIndex", nextQuestionIndex)
      )
      .first()

    if (!nextQuestion) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    await ctx.db.patch(gameStateId, {
      phase: "question",
      questionStartTime: Date.now(),
      currentQuestionId: nextQuestion._id,
      currentQuestionIndex: nextQuestionIndex,
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(
      TIMERS_MILLISECONDS.QUESTION_PHASE,
      internal.quiz.mutations.answerPhase,
      { roomId, gameStateId }
    )
  },
})

export const answerPhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const room = await validateRoomExists(ctx, roomId)

    const scheduledId = await ctx.scheduler.runAfter(
      room.timePerQuestion * 1000,
      internal.quiz.mutations.scorePhase,
      { roomId, gameStateId }
    )

    await ctx.db.patch(gameStateId, {
      scheduledFunctionId: scheduledId,
      answeringStartTime: Date.now(),
      updatedAt: Date.now(),
      phase: "answering",
    })
  },
})

export const scorePhase = internalMutation({
  args: {
    roomId: v.id("rooms"),
    gameStateId: v.id("gameStates"),
  },
  handler: async (ctx, args) => {
    const { roomId, gameStateId } = args

    const gameState = await validateGameStateExists(ctx, gameStateId)
    const room = await validateRoomExists(ctx, roomId)

    if (!gameState.currentQuestionId) {
      throw QUIZ_ERRORS.QUESTION_NOT_FOUND
    }

    await Promise.all(
      room.gamePlayerIds.map((playerId) =>
        processPlayerScore(ctx, { playerId, gameState, room })
      )
    )

    await ctx.db.patch(gameStateId, {
      phase: "score",
      scoreStartTime: Date.now(),
      updatedAt: Date.now(),
    })

    const isLast = isLastQuestion(
      gameState.currentQuestionIndex,
      room.numQuestions
    )
    await scheduleNextPhase(ctx, { isLast, roomId, gameStateId })
  },
})

export const saveQuestions = internalMutation({
  args: {
    gameStateId: v.id("gameStates"),
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()),
        correctAnswerIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { gameStateId, questions } = args

    await Promise.all(
      questions.map((question, index) =>
        ctx.db.insert("questions", {
          gameStateId,
          answers: question.answers,
          correctAnswerIndex: question.correctAnswerIndex,
          questionIndex: index,
          question: question.question,
        })
      )
    )
  },
})

async function validateUserAuthentication(
  ctx: MutationCtx
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx)
  if (!userId) {
    throw USER_ERRORS.NOT_AUTHENTICATED
  }
  return userId as Id<"users">
}

async function validateRoomExists(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<Doc<"rooms">> {
  const room = await ctx.db.get(roomId)
  if (!room) {
    throw ROOM_ERRORS.ROOM_NOT_FOUND
  }
  return room
}

async function validateGameStateExists(
  ctx: MutationCtx,
  gameStateId: Id<"gameStates">
): Promise<Doc<"gameStates">> {
  const gameState = await ctx.db.get(gameStateId)
  if (!gameState) {
    throw QUIZ_ERRORS.GAME_STATE_NOT_FOUND
  }
  return gameState
}

function validateRoomInLobbyState(room: Doc<"rooms">): void {
  if (room.status !== "lobby") {
    throw ROOM_ERRORS.ROOM_HAS_ALREADY_STARTED
  }
}

function validateUserIsHost(userId: Id<"users">, room: Doc<"rooms">): void {
  if (userId !== room.hostId) {
    throw ROOM_ERRORS.NOT_HOST
  }
}

function validateUserInRoom(userId: Id<"users">, room: Doc<"rooms">): void {
  if (!room.gamePlayerIds.includes(userId)) {
    throw ROOM_ERRORS.NOT_IN_ROOM
  }
}

function validateQuestionTimeNotExpired(
  gameState: Doc<"gameStates">,
  room: Doc<"rooms">
): void {
  if (!gameState.questionStartTime) return

  const hasQuestionTimeExpired =
    gameState.questionStartTime +
      room.timePerQuestion * 1000 +
      GRACE_PERIOD_MILLISECONDS <
    Date.now()

  if (hasQuestionTimeExpired) {
    throw QUIZ_ERRORS.QUESTION_TIME_EXPIRED
  }
}

async function createGameState(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<Id<"gameStates">> {
  return await ctx.db.insert("gameStates", {
    roomId,
    phase: "starting",
    updatedAt: Date.now(),
    currentQuestionIndex: -1, // We start at -1 because we don't have any questions yet
  })
}

async function initializePlayerScores(
  ctx: MutationCtx,
  gameStateId: Id<"gameStates">,
  playerIds: Id<"users">[]
): Promise<void> {
  await Promise.all(
    playerIds.map((playerId) =>
      ctx.db.insert("playerScores", {
        gameStateId,
        userId: playerId,
        score: 0,
        correctAnswers: 0,
        lastQuestionPointsEarned: 0,
        lastQuestionBasePoints: 0,
        lastQuestionTimeBonus: 0,
        timeBonus: 0,
        updatedAt: Date.now(),
      })
    )
  )
}

async function updateRoomToOngoing(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  gameStateId: Id<"gameStates">
): Promise<void> {
  await ctx.db.patch(roomId, {
    currentGameStateId: gameStateId,
    startedAt: Date.now(),
    status: "ongoing",
  })
}

async function getOrCreatePlayerAnswer(
  ctx: MutationCtx,
  params: {
    gameStateId: Id<"gameStates">
    questionId: Id<"questions">
    userId: Id<"users">
    answerIndex: number
    isCorrect: boolean
  }
): Promise<void> {
  const { gameStateId, questionId, userId, answerIndex, isCorrect } = params

  const existingAnswer = await ctx.db
    .query("playerAnswers")
    .withIndex("by_user_question", (q) =>
      q.eq("userId", userId).eq("questionId", questionId)
    )
    .first()

  if (existingAnswer) {
    await ctx.db.patch(existingAnswer._id, {
      answerIndex,
      answeredAt: Date.now(),
      isCorrect,
    })
  } else {
    await ctx.db.insert("playerAnswers", {
      gameStateId,
      questionId,
      userId,
      answerIndex,
      answeredAt: Date.now(),
      isCorrect,
    })
  }
}

async function checkAllPlayersAnswered(
  ctx: MutationCtx,
  questionId: Id<"questions">,
  totalPlayers: number
): Promise<boolean> {
  const allPlayerAnswers = await ctx.db
    .query("playerAnswers")
    .withIndex("by_question", (q) => q.eq("questionId", questionId))
    .collect()

  const playersWhoAnswered = new Set(
    allPlayerAnswers.map((answer) => answer.userId)
  )

  return playersWhoAnswered.size === totalPlayers
}

async function cancelScheduledFunction(
  ctx: MutationCtx,
  scheduledFunctionId: string
): Promise<void> {
  const scheduledFunction = await ctx.db.system.get(
    scheduledFunctionId as Id<"_scheduled_functions">
  )
  if (scheduledFunction) {
    await ctx.scheduler.cancel(scheduledFunction._id)
  }
}

function calculateScoreForCorrectAnswer(
  answerTime: number,
  questionStartTime: number,
  maxTime: number
): { pointsEarned: number; basePoints: number; timeBonus: number } {
  const timeElapsed = answerTime - questionStartTime
  const timeBonusMultiplier = Math.max(0, (maxTime - timeElapsed) / maxTime)

  const basePoints = BASE_POINTS
  const timeBonus = Math.round(
    basePoints * timeBonusMultiplier * TIME_BONUS_MULTIPLIER
  )
  const pointsEarned = basePoints + timeBonus

  return { pointsEarned, basePoints, timeBonus }
}

async function updatePlayerScoreForIncorrectAnswer(
  ctx: MutationCtx,
  playerScoreId: Id<"playerScores">
): Promise<void> {
  await ctx.db.patch(playerScoreId, {
    lastQuestionPointsEarned: 0,
    lastQuestionBasePoints: 0,
    lastQuestionTimeBonus: 0,
    updatedAt: Date.now(),
  })
}

async function updatePlayerScoreForCorrectAnswer(
  ctx: MutationCtx,
  params: {
    playerScore: Doc<"playerScores">
    pointsEarned: number
    basePoints: number
    timeBonus: number
  }
): Promise<void> {
  const { playerScore, pointsEarned, basePoints, timeBonus } = params

  await ctx.db.patch(playerScore._id, {
    score: playerScore.score + pointsEarned,
    correctAnswers: playerScore.correctAnswers + 1,
    lastQuestionPointsEarned: pointsEarned,
    lastQuestionBasePoints: basePoints,
    lastQuestionTimeBonus: timeBonus,
    timeBonus,
    updatedAt: Date.now(),
  })
}

async function processPlayerScore(
  ctx: MutationCtx,
  params: {
    playerId: Id<"users">
    gameState: Doc<"gameStates">
    room: Doc<"rooms">
  }
): Promise<void> {
  const { playerId, gameState, room } = params

  const [playerAnswer, playerScore] = await Promise.all([
    ctx.db
      .query("playerAnswers")
      .withIndex("by_user_question", (q) =>
        q.eq("userId", playerId).eq("questionId", gameState.currentQuestionId!)
      )
      .first(),
    ctx.db
      .query("playerScores")
      .withIndex("by_user_game", (q) =>
        q.eq("userId", playerId).eq("gameStateId", gameState._id)
      )
      .first(),
  ])

  if (!playerScore) {
    throw QUIZ_ERRORS.PLAYER_SCORE_NOT_FOUND
  }

  if (!playerAnswer || !playerAnswer.isCorrect) {
    await updatePlayerScoreForIncorrectAnswer(ctx, playerScore._id)
    return
  }

  const maxTime = room.timePerQuestion * 1000
  const { pointsEarned, basePoints, timeBonus } =
    calculateScoreForCorrectAnswer(
      playerAnswer.answeredAt,
      gameState.questionStartTime!,
      maxTime
    )

  await updatePlayerScoreForCorrectAnswer(ctx, {
    playerScore: playerScore,
    pointsEarned,
    basePoints,
    timeBonus,
  })
}

function isLastQuestion(
  currentQuestionIndex: number,
  totalQuestions: number
): boolean {
  return currentQuestionIndex === totalQuestions - 1
}

async function scheduleNextPhase(
  ctx: MutationCtx,
  params: {
    isLast: boolean
    roomId: Id<"rooms">
    gameStateId: Id<"gameStates">
  }
): Promise<void> {
  const { isLast, roomId, gameStateId } = params

  if (isLast) {
    await ctx.scheduler.runAfter(
      TIMERS_MILLISECONDS.SCORE_PHASE,
      internal.quiz.actions.finishQuiz,
      { roomId }
    )
  } else {
    await ctx.scheduler.runAfter(
      TIMERS_MILLISECONDS.SCORE_PHASE,
      internal.quiz.mutations.questionPhase,
      { roomId, gameStateId }
    )
  }
}
