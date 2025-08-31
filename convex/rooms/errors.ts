import { ConvexError } from "convex/values"

export enum RoomErrorCodes {
  INVALID_TIME_PER_QUESTION = "INVALID_TIME_PER_QUESTION",
  INVALID_NUMBER_OF_QUESTIONS = "INVALID_NUMBER_OF_QUESTIONS",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  ROOM_NOT_ACCEPTING_PLAYERS = "ROOM_NOT_ACCEPTING_PLAYERS",
  ALREADY_IN_ROOM = "ALREADY_IN_ROOM",
  NOT_IN_ROOM = "NOT_IN_ROOM",
  CANNOT_LEAVE_ROOM = "CANNOT_LEAVE_ROOM",
  ROOM_HAS_ALREADY_STARTED = "ROOM_HAS_ALREADY_STARTED",
  NOT_HOST = "NOT_HOST",
}

export const ROOM_ERRORS = {
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
  NOT_IN_ROOM: new ConvexError({
    code: RoomErrorCodes.NOT_IN_ROOM,
    message: "You are not in this room",
  }),
  CANNOT_LEAVE_ROOM: new ConvexError({
    code: RoomErrorCodes.CANNOT_LEAVE_ROOM,
    message: "Cannot leave room, game is in progress",
  }),
  ROOM_HAS_ALREADY_STARTED: new ConvexError({
    code: RoomErrorCodes.ROOM_HAS_ALREADY_STARTED,
    message: "Game has already started",
  }),
  NOT_HOST: new ConvexError({
    code: RoomErrorCodes.NOT_HOST,
    message: "You are not the host of this room",
  }),
} as const
