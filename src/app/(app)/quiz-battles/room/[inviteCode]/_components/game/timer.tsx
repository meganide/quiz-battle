"use client"

import React from "react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type TimerProps = {
  duration: number
}

export function Timer({ duration }: TimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const startTimeRef = React.useRef<number | null>(null)
  const animationFrameRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    setTimeLeft(duration)
    startTimeRef.current = Date.now()
  }, [duration])

  React.useEffect(() => {
    if (duration <= 0) return

    startTimeRef.current = Date.now()

    const updateTimer = () => {
      if (!startTimeRef.current) return

      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const remaining = Math.max(0, duration - elapsed)

      setTimeLeft(remaining)

      if (remaining <= 0) {
        return
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer)
    }

    animationFrameRef.current = requestAnimationFrame(updateTimer)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [duration])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressValue = duration > 0 ? (timeLeft / duration) * 100 : 0
  const isLowTime = timeLeft <= 10 && timeLeft > 0

  return (
    <section className={cn("flex flex-col items-center gap-2")}>
      <p
        className={cn(
          "text-2xl font-bold transition-colors",
          isLowTime && "animate-pulse text-red-500"
        )}
      >
        {formatTime(timeLeft)}
      </p>
      <Progress
        value={progressValue}
        className={cn(
          "w-full transition-all duration-75 ease-linear",
          isLowTime && "[&>div]:bg-red-500"
        )}
      />
    </section>
  )
}
