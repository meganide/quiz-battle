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
  const {
    progressValue,
    progressDurationMs,
    isLowTime,
    timeLeft,
    disableAnimation,
  } = useTimer({
    gameState,
    duration,
  })

  return (
    <section className={cn("flex flex-col items-center gap-1")}>
      <Progress
        disableAnimation={disableAnimation}
        durationMs={progressDurationMs}
        value={progressValue}
        className={cn("w-full", {
          "[&>div]:bg-destructive": isLowTime,
          "[&>div]:bg-primary": gameState.phase === "results",
        })}
      />
      <p
        className={cn(
          "text-2xl font-bold",
          isLowTime && "text-destructive animate-pulse",
          gameState.phase === "results" && "text-primary"
        )}
      >
        {Math.floor(timeLeft)}
      </p>
    </section>
  )
}
