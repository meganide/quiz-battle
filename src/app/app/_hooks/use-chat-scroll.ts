import { useCallback, useEffect, useRef, useState } from "react"

type Message = {
  _id: string
  _creationTime: number
}

export function useChatScroll(
  messages: Message[] | undefined,
  threshold = 100
) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const previousMessageIdsRef = useRef<string[]>([])

  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      })
    }
  }, [])

  const checkIfAtBottom = useCallback(() => {
    if (!scrollRef.current) return true

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom <= threshold
  }, [threshold])

  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom()
    setIsAtBottom(atBottom)
  }, [checkIfAtBottom])

  // Handle scrolling when messages change
  useEffect(() => {
    if (!messages || messages.length === 0) {
      return
    }

    const currentMessageIds = messages.map((m) => m._id)
    const previousMessageIds = previousMessageIdsRef.current

    // Check if this is the initial load
    const isInitialLoad = previousMessageIds.length === 0

    // Check if there are new messages
    const hasNewMessages = currentMessageIds.some(
      (id) => !previousMessageIds.includes(id)
    )

    // Update the ref
    previousMessageIdsRef.current = currentMessageIds

    if (isInitialLoad) {
      // Always scroll to bottom on initial load
      const timeoutId = setTimeout(() => {
        scrollToBottom(false)
        setIsAtBottom(true)
      }, 100)
      return () => clearTimeout(timeoutId)
    }

    if (hasNewMessages && isAtBottom) {
      // Auto-scroll to bottom if user is at bottom and there are new messages
      const timeoutId = setTimeout(() => {
        scrollToBottom(true)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, isAtBottom, scrollToBottom])

  return {
    scrollRef,
    isAtBottom,
    scrollToBottom,
    handleScroll,
  }
}
