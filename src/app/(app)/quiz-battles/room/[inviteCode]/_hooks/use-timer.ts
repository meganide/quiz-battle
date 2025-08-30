import React from "react"

import type { GameState } from "~/convex/quiz/types"

import { SHOW_RESULTS_TIME_MILLISECONDS } from "~/convex/quiz/constants"

const RESULTS_DURATION = SHOW_RESULTS_TIME_MILLISECONDS / 1000 // seconds

type UseTimerProps = {
  gameState: GameState["gameState"]
  duration: number
}

export function useTimer({ gameState, duration }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const animationFrameRef = React.useRef<number | null>(null)

  const isResultsPhase = gameState.phase === "results"
  const isQuestionPhase = gameState.phase === "question"
  const resultsStartTime = isResultsPhase ? gameState.updatedAt : undefined
  const questionStartTime = gameState.questionStartTime ?? Date.now()

  React.useEffect(() => {
    if (isQuestionPhase && (duration <= 0 || questionStartTime <= 0)) return
    if (isResultsPhase && (!resultsStartTime || resultsStartTime <= 0)) return

    const updateTimer = () => {
      let elapsed: number
      let maxDuration: number

      if (isResultsPhase && resultsStartTime) {
        elapsed = (Date.now() - resultsStartTime) / 1000
        maxDuration = RESULTS_DURATION
      } else {
        // Question phase: countdown from question duration
        elapsed = (Date.now() - questionStartTime) / 1000
        maxDuration = duration
      }

      const remaining = Math.max(0, maxDuration - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        return
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer)
    }

    updateTimer()
    animationFrameRef.current = requestAnimationFrame(updateTimer)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, questionStartTime, gameState.phase, resultsStartTime])

  // Calculate progress value based on phase
  const maxDuration = isResultsPhase ? RESULTS_DURATION : duration
  const progressValue = maxDuration > 0 ? (timeLeft / maxDuration) * 100 : 0
  const isLowTime = timeLeft <= 10 && timeLeft > 0

  return { progressValue, isLowTime, timeLeft }
}
