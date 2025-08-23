import { ErrorWithCode } from "../error";

export const ROOM_ERRORS = {
  ACTIVE_ROOM_EXISTS: new ErrorWithCode({
    code: "ACTIVE_ROOM_EXISTS",
    message:
      "You already have an active room. Complete or leave your current room before creating a new one.",
  }),
} as const;
