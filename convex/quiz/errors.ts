import { ConvexError } from "convex/values"

export enum QuizErrorCodes {
  NOT_HOST = "NOT_HOST",
}

export const QUIZ_ERRORS = {
  NOT_HOST: new ConvexError({
    code: QuizErrorCodes.NOT_HOST,
    message: "You are not the host of this room",
  }),
} as const
