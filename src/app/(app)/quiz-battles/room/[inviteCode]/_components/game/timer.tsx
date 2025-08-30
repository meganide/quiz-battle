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
        className={cn("[&>div]:bg-primary w-full", {
          "[&>div]:bg-destructive": isLowTime,
        })}
      />
      <p
        className={cn("text-foreground text-2xl font-bold", {
          "text-destructive animate-pulse":
            isLowTime && gameState.phase === "question",
        })}
      >
        {Math.floor(timeLeft)}
      </p>
    </section>
  )
}
