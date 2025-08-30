"use client"

import React from "react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { SHOW_RESULTS_TIME_MILLISECONDS } from "~/convex/quiz/constants"

type TimerProps = {
  duration: number
  questionStartTime: number
  phase?: "question" | "results"
  resultsStartTime?: number
}

const RESULTS_DURATION = SHOW_RESULTS_TIME_MILLISECONDS / 1000 // seconds

export function Timer({
  duration,
  questionStartTime,
  phase = "question",
  resultsStartTime,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const animationFrameRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (phase === "question" && (duration <= 0 || questionStartTime <= 0))
      return
    if (phase === "results" && (!resultsStartTime || resultsStartTime <= 0))
      return

    const updateTimer = () => {
      let elapsed: number
      let maxDuration: number

      if (phase === "results" && resultsStartTime) {
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
  }, [duration, questionStartTime, phase, resultsStartTime])

  // Calculate progress value based on phase
  const maxDuration = phase === "results" ? RESULTS_DURATION : duration
  const progressValue = maxDuration > 0 ? (timeLeft / maxDuration) * 100 : 0
  const isLowTime = timeLeft <= 10 && timeLeft > 0

  return (
    <section className={cn("flex flex-col items-center gap-1")}>
      <Progress
        value={progressValue}
        className={cn(
          "w-full transition-all duration-75 ease-linear",
          isLowTime && "[&>div]:bg-red-500",
          phase === "results" && "[&>div]:bg-blue-500"
        )}
      />
      <p
        className={cn(
          "text-2xl font-bold transition-colors",
          isLowTime && "animate-pulse text-red-500",
          phase === "results" && "text-blue-600"
        )}
      >
        {phase === "results" ? Math.ceil(timeLeft) : formatTime(timeLeft)}
      </p>
    </section>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
