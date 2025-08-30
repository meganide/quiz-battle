"use client"

import type * as React from "react"

import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  disableAnimation?: boolean
  durationMs?: number
}

function Progress({
  className,
  disableAnimation = false,
  durationMs,
  value,
  ...props
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, Number(value ?? 0)))
  const indicatorClassName = cn(
    "bg-primary h-full w-full flex-1 transition-transform",
    disableAnimation && "transition-none"
  )
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={indicatorClassName}
        data-slot="progress-indicator"
        style={{
          transform: `translateX(-${100 - clampedValue}%)`,
          transitionDuration: disableAnimation
            ? undefined
            : `${durationMs ?? 0}ms`,
          transitionTimingFunction: disableAnimation ? undefined : "linear",
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
