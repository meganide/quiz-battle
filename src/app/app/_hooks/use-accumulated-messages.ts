import { useEffect, useState } from "react"

import { useQuery } from "convex/react"

import type { ChatMessage } from "~/convex/chat/types"

import { api } from "~/convex/_generated/api"

type UseAccumulatedMessagesOptions = {
  chatRoomId: string
}

export function useAccumulatedMessages({
  chatRoomId,
}: UseAccumulatedMessagesOptions) {
  const [accumulatedMessages, setAccumulatedMessages] = useState<ChatMessage[]>(
    []
  )

  const latestMessages = useQuery(api.chat.queries.getMessages, {
    chatRoomId,
  })

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
