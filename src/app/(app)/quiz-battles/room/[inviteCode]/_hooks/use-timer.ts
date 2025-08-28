import React from "react"

type UseTimerProps = {
  duration: number // in seconds
  onTimeUp: () => void
  isActive: boolean
  startTime?: number // timestamp when timer started
}

export function useTimer({
  duration,
  onTimeUp,
  isActive,
  startTime,
}: UseTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)

  React.useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration)
      return
    }

    let interval: NodeJS.Timeout
    let hasCalledTimeUp = false

    if (startTime) {
      // Calculate time left based on start time (for server sync)
      const updateTimeLeft = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = Math.max(0, duration - elapsed)
        setTimeLeft(remaining)

        if (remaining === 0 && !hasCalledTimeUp) {
          hasCalledTimeUp = true
          onTimeUp()
        }
      }

      // Update immediately
      updateTimeLeft()

      // Then update every second
      interval = setInterval(updateTimeLeft, 1000)
    } else {
      // Fallback to simple countdown
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          if (newTime <= 0) {
            if (!hasCalledTimeUp) {
              hasCalledTimeUp = true
              onTimeUp()
            }
            return 0
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [duration, onTimeUp, isActive, startTime])

  const percentage = ((duration - timeLeft) / duration) * 100

  return {
    timeLeft,
    percentage,
    isTimeUp: timeLeft === 0,
  }
}
