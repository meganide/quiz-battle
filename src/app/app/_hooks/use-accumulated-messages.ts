import { useEffect, useState } from "react"

import { useQuery } from "convex/react"

import type { ChatMessage } from "~/convex/chat/types"

import { useChatStore } from "@/app/stores/chat-store"
import { api } from "~/convex/_generated/api"

export function useAccumulatedMessages() {
  const [accumulatedMessages, setAccumulatedMessages] = useState<ChatMessage[]>(
    []
  )

  const { selectedChatRoomId } = useChatStore()

  const latestMessages = useQuery(api.chat.queries.getMessages, {
    chatRoomId: selectedChatRoomId,
  })

  useEffect(() => {
    setAccumulatedMessages([])
  }, [selectedChatRoomId])

  useEffect(() => {
    if (!latestMessages || latestMessages.length === 0) {
      return
    }

    setAccumulatedMessages((previousMessages) => {
      const existingMessageIds = new Set(previousMessages.map((msg) => msg._id))

      const newMessages = latestMessages.filter(
        (msg) => !existingMessageIds.has(msg._id)
      )

      if (newMessages.length === 0) {
        return previousMessages
      }

      const combinedMessages = [...previousMessages, ...newMessages]
      return combinedMessages.sort((a, b) => a._creationTime - b._creationTime)
    })
  }, [latestMessages])

  return accumulatedMessages
}
