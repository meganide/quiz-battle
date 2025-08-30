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
  const [disableAnimation, setDisableAnimation] = React.useState(false)
  const [progressValue, setProgressValue] = React.useState(100)
  const [progressDurationMs, setProgressDurationMs] = React.useState(0)
  const intervalRef = React.useRef<number | null>(null)
  const lastPhaseKeyRef = React.useRef<string>("")

  const isResultsPhase = gameState.phase === "results"
  const isQuestionPhase = gameState.phase === "question"
  const resultsStartTime = isResultsPhase ? gameState.updatedAt : undefined
  const questionStartTime = gameState.questionStartTime ?? Date.now()

  // Start a lightweight interval to update the numeric countdown only
  React.useEffect(() => {
    if (isQuestionPhase && (duration <= 0 || questionStartTime <= 0)) return
    if (isResultsPhase && (!resultsStartTime || resultsStartTime <= 0)) return

    const totalMs = (isResultsPhase ? RESULTS_DURATION : duration) * 1000
    const startMs =
      isResultsPhase && resultsStartTime ? resultsStartTime : questionStartTime
    if (!startMs) return

    const endTime = startMs + totalMs

    const tick = () => {
      const remainingMs = Math.max(0, endTime - Date.now())
      setTimeLeft(remainingMs / 1000)
      if (remainingMs <= 0 && intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    tick()
    intervalRef.current = window.setInterval(tick, 200)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isQuestionPhase,
    isResultsPhase,
    questionStartTime,
    resultsStartTime,
    duration,
  ])

  // Drive the progress bar via a single CSS transition per phase
  React.useEffect(() => {
    if (isQuestionPhase && (duration <= 0 || questionStartTime <= 0)) return
    if (isResultsPhase && (!resultsStartTime || resultsStartTime <= 0)) return

    const totalMs = (isResultsPhase ? RESULTS_DURATION : duration) * 1000
    const startMs =
      isResultsPhase && resultsStartTime ? resultsStartTime : questionStartTime
    if (!startMs) return

    const phaseKey = `${isResultsPhase ? "results" : "question"}-${startMs}-${totalMs}`
    if (lastPhaseKeyRef.current === phaseKey) return
    lastPhaseKeyRef.current = phaseKey

    const now = Date.now()
    const elapsedMs = Math.max(0, now - startMs)
    const remainingMs = Math.max(0, totalMs - elapsedMs)
    const startPercent = totalMs > 0 ? (remainingMs / totalMs) * 100 : 0

    // Reset without transition to current percent, then animate to 0 linearly
    setDisableAnimation(true)
    setProgressDurationMs(remainingMs)
    setProgressValue(startPercent)

    // Use a small delay to ensure the DOM has updated before starting animation
    const timeoutId = setTimeout(() => {
      setDisableAnimation(false)
      setProgressValue(0)
    }, 16) // 16ms ≈ 1 frame

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isQuestionPhase,
    isResultsPhase,
    questionStartTime,
    resultsStartTime,
    duration,
  ])

  const isLowTime = timeLeft <= 10.5 && timeLeft >= 0

  return {
    progressValue,
    progressDurationMs,
    isLowTime,
    timeLeft,
    disableAnimation,
  }
}
