import { ConvexError } from "convex/values"

export enum UserErrorCodes {
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
}

export const USER_ERRORS = {
  NOT_AUTHENTICATED: new ConvexError({
    code: UserErrorCodes.NOT_AUTHENTICATED,
    message: "You must be authenticated to perform this action",
  }),
} as const
