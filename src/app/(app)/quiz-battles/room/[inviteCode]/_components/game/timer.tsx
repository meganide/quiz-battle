"use client"

import type { GameState } from "~/convex/quiz/types"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { useTimer } from "../../_hooks/use-timer"

type TimerProps = {
  duration: number
  gameState: GameState["gameState"]
}

export function Timer({ duration, gameState }: TimerProps) {
  const { progressValue, isLowTime, timeLeft, disableAnimation } = useTimer({
    gameState,
    duration,
  })

  return (
    <section className={cn("flex flex-col items-center gap-1")}>
      <Progress
        disableAnimation={disableAnimation}
        value={progressValue}
        className={cn(
          "w-full",
          isLowTime && "[&>div]:bg-red-500",
          gameState.phase === "results" && "[&>div]:bg-blue-500"
        )}
      />
      <p
        className={cn(
          "text-2xl font-bold transition-colors",
          isLowTime && "animate-pulse text-red-500",
          gameState.phase === "results" && "text-blue-600"
        )}
      >
        {gameState.phase === "results"
          ? Math.ceil(timeLeft)
          : formatTime(timeLeft)}
      </p>
    </section>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
