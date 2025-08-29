import { ConvexError } from "convex/values"

export enum QuizErrorCodes {
  NOT_HOST = "NOT_HOST",
  GAME_STATE_NOT_FOUND = "GAME_STATE_NOT_FOUND",
  QUESTION_NOT_FOUND = "QUESTION_NOT_FOUND",
  QUESTION_TIME_EXPIRED = "QUESTION_TIME_EXPIRED",
  PLAYER_SCORE_NOT_FOUND = "PLAYER_SCORE_NOT_FOUND",
  PLAYER_ANSWER_NOT_FOUND = "PLAYER_ANSWER_NOT_FOUND",
}

export const QUIZ_ERRORS = {
  NOT_HOST: new ConvexError({
    code: QuizErrorCodes.NOT_HOST,
    message: "You are not the host of this room",
  }),
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
  PLAYER_ANSWER_NOT_FOUND: new ConvexError({
    code: QuizErrorCodes.PLAYER_ANSWER_NOT_FOUND,
    message: "Player answer not found",
  }),
} as const
