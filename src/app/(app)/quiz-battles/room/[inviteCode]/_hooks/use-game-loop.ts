import React from "react"

import { useQuery } from "convex/react"

import type { Id } from "~/convex/_generated/dataModel"

import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

export function useGameLoop(roomId: Id<"rooms"> | undefined) {
  const user = useUser()
  const gameState = useQuery(
    api.quiz.queries.getGameState,
    roomId ? { roomId } : "skip"
  )

  const currentQuestion = useQuery(
    api.quiz.queries.getCurrentQuestion,
    gameState?._id ? { gameStateId: gameState._id } : "skip"
  )

  const userAnswer = useQuery(
    api.quiz.queries.getUserAnswer,
    currentQuestion?._id && user?._id
      ? { questionId: currentQuestion._id, userId: user._id }
      : "skip"
  )

  const questionResults = useQuery(
    api.quiz.queries.getQuestionResults,
    gameState?.phase === "results" && currentQuestion?._id
      ? { questionId: currentQuestion._id }
      : "skip"
  )

  const [hasAnswered, setHasAnswered] = React.useState(false)

  // Reset hasAnswered when question changes
  React.useEffect(() => {
    setHasAnswered(false)
  }, [currentQuestion?._id])

  // Update hasAnswered based on userAnswer
  React.useEffect(() => {
    if (userAnswer) {
      setHasAnswered(true)
    }
  }, [userAnswer])

  return {
    gameState,
    currentQuestion,
    userAnswer,
    questionResults,
    hasAnswered,
    setHasAnswered,
  }
}
