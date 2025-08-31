import { ConvexError } from "convex/values"

export enum QuizErrorCodes {
  GAME_STATE_NOT_FOUND = "GAME_STATE_NOT_FOUND",
  QUESTION_NOT_FOUND = "QUESTION_NOT_FOUND",
  QUESTION_TIME_EXPIRED = "QUESTION_TIME_EXPIRED",
  PLAYER_SCORE_NOT_FOUND = "PLAYER_SCORE_NOT_FOUND",
  GAME_STATE_IN_QUESTION_PHASE = "GAME_STATE_IN_QUESTION_PHASE",
  GAME_STATE_NOT_IN_QUESTION_PHASE = "GAME_STATE_NOT_IN_QUESTION_PHASE",
  GAME_STATE_NOT_IN_ANSWERING_PHASE = "GAME_STATE_NOT_IN_ANSWERING_PHASE",
  GAME_STATE_NOT_IN_SCORE_PHASE = "GAME_STATE_NOT_IN_SCORE_PHASE",
}

export const QUIZ_ERRORS = {
  GAME_STATE_NOT_FOUND: new ConvexError({
    code: QuizErrorCodes.GAME_STATE_NOT_FOUND,
    message: "Game state not found",
  }),
  QUESTION_NOT_FOUND: new ConvexError({
    code: QuizErrorCodes.QUESTION_NOT_FOUND,
    message: "Question not found",
  }),
  QUESTION_TIME_EXPIRED: new ConvexError({
    code: QuizErrorCodes.QUESTION_TIME_EXPIRED,
    message: "Question time expired",
  }),
  PLAYER_SCORE_NOT_FOUND: new ConvexError({
    code: QuizErrorCodes.PLAYER_SCORE_NOT_FOUND,
    message: "Player score not found",
  }),
  GAME_STATE_IN_QUESTION_PHASE: new ConvexError({
    code: QuizErrorCodes.GAME_STATE_IN_QUESTION_PHASE,
    message: "Game state is in question phase",
  }),
  GAME_STATE_NOT_IN_QUESTION_PHASE: new ConvexError({
    code: QuizErrorCodes.GAME_STATE_NOT_IN_QUESTION_PHASE,
    message: "Game state is not in question phase",
  }),
  GAME_STATE_NOT_IN_ANSWERING_PHASE: new ConvexError({
    code: QuizErrorCodes.GAME_STATE_NOT_IN_ANSWERING_PHASE,
    message: "Game state is not in answering phase",
  }),
  GAME_STATE_NOT_IN_SCORE_PHASE: new ConvexError({
    code: QuizErrorCodes.GAME_STATE_NOT_IN_SCORE_PHASE,
    message: "Game state is not in score phase",
  }),
} as const
