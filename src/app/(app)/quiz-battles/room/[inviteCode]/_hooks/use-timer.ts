import React from "react"

import type { Doc } from "~/convex/_generated/dataModel"

import { TIMERS_MILLISECONDS } from "~/convex/quiz/constants"

const SCORE_DURATION = TIMERS_MILLISECONDS.SCORE_PHASE / 1000 // seconds

type UseTimerProps = {
  gameState: Doc<"gameStates">
  duration: number
}

export function useTimer({ gameState, duration }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const [disableAnimation, setDisableAnimation] = React.useState(false)
  const [progressValue, setProgressValue] = React.useState(100)
  const [progressDurationMs, setProgressDurationMs] = React.useState(0)
  const intervalRef = React.useRef<number | null>(null)
  const lastPhaseKeyRef = React.useRef<string>("")

  const isScorePhase = gameState.phase === "score"
  const isAnswerPhase = gameState.phase === "answering"
  const scoreStartTime = gameState.scoreStartTime
  const answerStartTime = gameState.answeringStartTime

  // Start a lightweight interval to update the numeric countdown only
  React.useEffect(() => {
    if (
      isAnswerPhase &&
      (!answerStartTime || duration <= 0 || answerStartTime <= 0)
    ) {
      return
    }
    if (isScorePhase && (!scoreStartTime || scoreStartTime <= 0)) {
      return
    }

    const totalMs = (isScorePhase ? SCORE_DURATION : duration) * 1000
    const startMs =
      isScorePhase && scoreStartTime ? scoreStartTime : answerStartTime
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
  }, [isAnswerPhase, isScorePhase, answerStartTime, scoreStartTime, duration])

  // Drive the progress bar via a single CSS transition per phase
  React.useEffect(() => {
    if (
      isAnswerPhase &&
      (!answerStartTime || duration <= 0 || answerStartTime <= 0)
    ) {
      return
    }
    if (isScorePhase && (!scoreStartTime || scoreStartTime <= 0)) {
      return
    }

    const totalMs = (isScorePhase ? SCORE_DURATION : duration) * 1000
    const startMs =
      isScorePhase && scoreStartTime ? scoreStartTime : answerStartTime
    if (!startMs) return

    const phaseKey = `${isScorePhase ? "results" : "question"}-${startMs}-${totalMs}`
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
  }, [isAnswerPhase, isScorePhase, answerStartTime, scoreStartTime, duration])

  const isLowTime = timeLeft <= 10.5 && timeLeft >= 0

  return {
    progressValue,
    progressDurationMs,
    isLowTime,
    timeLeft,
    disableAnimation,
  }
}
