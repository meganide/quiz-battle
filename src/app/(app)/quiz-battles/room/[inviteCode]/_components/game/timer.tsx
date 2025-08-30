"use client"

import type { Doc } from "~/convex/_generated/dataModel"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { useTimer } from "../../_hooks/use-timer"

type TimerProps = {
  duration: number
  gameState: Doc<"gameStates">
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
          "[&>div]:bg-destructive":
            isLowTime && gameState.phase === "answering",
        })}
      />
      <p
        className={cn("text-foreground text-2xl font-bold", {
          "text-destructive animate-pulse":
            isLowTime && gameState.phase === "answering",
        })}
      >
        {Math.floor(timeLeft)}
      </p>
    </section>
  )
}
