import { useMutation, useQuery } from "convex/react"

import type { Id } from "~/convex/_generated/dataModel"

import { api } from "~/convex/_generated/api"

export function useGameState(roomId: Id<"rooms"> | undefined) {
  const gameState = useQuery(
    api.quiz.queries.getGameState,
    roomId ? { roomId } : "skip"
  )

  const gameProgress = useQuery(
    api.quiz.queries.getGameProgress,
    roomId ? { roomId } : "skip"
  )

  const currentQuestion = useQuery(
    api.quiz.queries.getCurrentQuestion,
    gameState?._id ? { gameStateId: gameState._id } : "skip"
  )

  const playerScores = useQuery(
    api.quiz.queries.getPlayerScores,
    gameState?._id ? { gameStateId: gameState._id } : "skip"
  )

  const submitAnswer = useMutation(api.quiz.mutations.submitAnswer)

  return {
    gameState,
    gameProgress,
    currentQuestion,
    playerScores,
    submitAnswer,
    isLoading: gameState === undefined || gameProgress === undefined,
  }
}
