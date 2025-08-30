"use client"

import type * as React from "react"

import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  disableAnimation?: boolean
}

function Progress({
  className,
  value,
  disableAnimation = false,
  ...props
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, Number(value ?? 0)))
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
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        className={cn(
          "bg-primary h-full w-full flex-1 transition-all",
          disableAnimation && "transition-none"
        )}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
