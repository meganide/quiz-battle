"use client"

import { useEffect } from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AnimatedScoreCounterProps = {
  currentScore: number
  previousScore: number
  isScorePhase: boolean
  position: number
  delay?: number
  wasCorrectAnswer?: boolean
}

export function AnimatedScoreCounter({
  currentScore,
  previousScore,
  isScorePhase,
  position,
  delay = 0,
  wasCorrectAnswer = false,
}: AnimatedScoreCounterProps) {
  const motionValue = useMotionValue(previousScore)
  const spring = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })
  const display = useTransform(spring, (value) =>
    Math.round(value).toLocaleString()
  )

  useEffect(() => {
    if (isScorePhase && currentScore > previousScore && wasCorrectAnswer) {
      // Start from previous score, then animate to current score after delay
      motionValue.set(previousScore)
      const timer = setTimeout(() => {
        motionValue.set(currentScore)
      }, delay)

      return () => clearTimeout(timer)
    } else if (!isScorePhase) {
      // Immediately set to current score when not in score phase
      motionValue.set(currentScore)
    } else {
      // Set to current score if in score phase but no animation needed
      motionValue.set(currentScore)
    }
  }, [
    isScorePhase,
    currentScore,
    previousScore,
    motionValue,
    delay,
    wasCorrectAnswer,
  ])

  return (
    <motion.div
      animate={
        isScorePhase && currentScore > previousScore && wasCorrectAnswer
          ? {
              scale: [1, 1.2, 1],
              rotateZ: [0, 2, -2, 0],
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay: delay + 0.2,
        type: "tween", // Use tween for multi-keyframe animations
        ease: "easeInOut",
      }}
    >
      <Badge
        className={cn(
          "bg-secondary text-secondary-foreground border-none text-sm font-bold transition-colors duration-300",
          {
            "bg-yellow-500 text-yellow-50": position === 1,
            "bg-gray-500 text-gray-50": position === 2,
            "bg-amber-500 text-amber-50": position === 3,
            // Score increase animation colors
            "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg":
              isScorePhase && currentScore > previousScore && wasCorrectAnswer,
          }
        )}
      >
        <motion.span>{display}</motion.span>
      </Badge>
    </motion.div>
  )
}
