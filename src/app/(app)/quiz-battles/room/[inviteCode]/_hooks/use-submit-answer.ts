import React from "react"

import { useMutation } from "convex/react"

import type { GameState } from "~/convex/quiz/types"

import { api } from "~/convex/_generated/api"

type UseSubmitAnswerProps = {
  gameState: GameState["gameState"]
}

export function useSubmitAnswer({ gameState }: UseSubmitAnswerProps) {
  const [selectedAnswerIndex, setSelectedAnswerIndex] =
    React.useState<number>(-1)

  const submitAnswerMutation = useMutation(api.quiz.mutations.submitAnswer)

  function submitAnswer(answerIndex: number) {
    if (!gameState._id) {
      return
    }

    setSelectedAnswerIndex(answerIndex)

    void submitAnswerMutation({
      gameStateId: gameState._id,
      answerIndex,
    })
  }

  React.useEffect(() => {
    if (selectedAnswerIndex !== -1) {
      setSelectedAnswerIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentQuestionIndex])

  return {
    selectedAnswerIndex,
    submitAnswer,
  }
}
