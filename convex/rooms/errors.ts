import { ConvexError } from "convex/values"

export enum RoomErrorCodes {
  ACTIVE_ROOM_EXISTS = "ACTIVE_ROOM_EXISTS",
  INVALID_TIME_PER_QUESTION = "INVALID_TIME_PER_QUESTION",
  INVALID_NUMBER_OF_QUESTIONS = "INVALID_NUMBER_OF_QUESTIONS",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_NOT_ACCEPTING_PLAYERS = "ROOM_NOT_ACCEPTING_PLAYERS",
  ALREADY_IN_ROOM = "ALREADY_IN_ROOM",
}

export const ROOM_ERRORS = {
  ACTIVE_ROOM_EXISTS: new ConvexError({
    code: RoomErrorCodes.ACTIVE_ROOM_EXISTS,
    message:
      "You already have an active room. Complete or leave your current room before creating a new one.",
  }),
  INVALID_TIME_PER_QUESTION: new ConvexError({
    code: RoomErrorCodes.INVALID_TIME_PER_QUESTION,
    message: "Time per question must be between 10 and 60 seconds",
  }),
  INVALID_NUMBER_OF_QUESTIONS: new ConvexError({
    code: RoomErrorCodes.INVALID_NUMBER_OF_QUESTIONS,
    message: "Number of questions must be positive",
  }),
  ROOM_NOT_FOUND: new ConvexError({
    code: RoomErrorCodes.ROOM_NOT_FOUND,
    message: "Room not found",
  }),
  ROOM_NOT_ACCEPTING_PLAYERS: new ConvexError({
    code: RoomErrorCodes.ROOM_NOT_ACCEPTING_PLAYERS,
    message: "Room is not accepting new players",
  }),
  ALREADY_IN_ROOM: new ConvexError({
    code: RoomErrorCodes.ALREADY_IN_ROOM,
    message: "Already in this room",
  }),
} as const
