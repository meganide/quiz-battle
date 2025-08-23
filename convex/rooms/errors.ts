import { ConvexError } from "convex/values"

export const ROOM_ERRORS = {
  ACTIVE_ROOM_EXISTS: new ConvexError({
    code: "ACTIVE_ROOM_EXISTS",
    message:
      "You already have an active room. Complete or leave your current room before creating a new one.",
  }),
} as const
