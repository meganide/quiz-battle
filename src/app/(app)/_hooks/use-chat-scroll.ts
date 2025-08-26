import { useCallback, useEffect, useRef, useState } from "react"

type Message = {
  _id: string
  _creationTime: number
}

export function useChatScroll(
  messages: Message[] | undefined,
  roomId?: string,
  threshold = 100
) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const previousMessageIdsRef = useRef<string[]>([])
  const previousRoomIdRef = useRef<string | undefined>(roomId)

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

  // Handle room changes separately - always scroll to bottom when room changes
  useEffect(() => {
    const previousRoomId = previousRoomIdRef.current
    const hasRoomChanged =
      roomId !== previousRoomId && previousRoomId !== undefined

    if (hasRoomChanged) {
      // Update room ref immediately
      previousRoomIdRef.current = roomId

      // Force scroll to bottom on room change with multiple attempts to ensure it works
      const scrollToBottomOnRoomChange = function () {
        scrollToBottom(false)
        setIsAtBottom(true)
      }

      // Immediate scroll
      scrollToBottomOnRoomChange()

      // Backup scroll after a delay to handle any race conditions
      const timeoutId = setTimeout(scrollToBottomOnRoomChange, 150)

      return () => clearTimeout(timeoutId)
    }
  }, [roomId, scrollToBottom])

  // Handle initial load and message changes
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

    // Update the message ids ref
    previousMessageIdsRef.current = currentMessageIds

    // Initialize room ref on first load
    if (isInitialLoad && previousRoomIdRef.current === undefined) {
      previousRoomIdRef.current = roomId
    }

    if (isInitialLoad) {
      // Always scroll to bottom on initial load
      const timeoutId = setTimeout(() => {
        scrollToBottom(false)
        setIsAtBottom(true)
      }, 100)
      return () => clearTimeout(timeoutId)
    }

    if (hasNewMessages && isAtBottom) {
      // Only auto-scroll for new messages if user is at bottom
      const timeoutId = setTimeout(() => {
        scrollToBottom(true)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, roomId, isAtBottom, scrollToBottom])

  return {
    scrollRef,
    isAtBottom,
    scrollToBottom,
    handleScroll,
  }
}
