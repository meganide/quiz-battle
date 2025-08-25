import React from "react"

import { useMutation } from "convex/react"
import throttle from "lodash/throttle"

import { api } from "~/convex/_generated/api"

export function useSendMessage() {
  const [message, setMessage] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)

  const sendMessageMutation = useMutation(api.chat.mutations.sendMessage)

  const isMessageEmpty = message.length === 0
  const isMessageTooLong = message.length > 280
  const isButtonDisabled = isMessageEmpty || isMessageTooLong || isSending

  const sendMessage = React.useCallback(async () => {
    setIsSending(true)

    try {
      await sendMessageMutation({
        chatRoomId: "global_chat",
        message,
      })
      setMessage("")
      setIsSending(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }, [message, sendMessageMutation])

  const throttledSendMessage = throttle(sendMessage, 400)

  const handleKeyDown = React.useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        if (isButtonDisabled) return
        event.preventDefault()
        await throttledSendMessage()
      }
    },
    [isButtonDisabled, throttledSendMessage]
  )

  return {
    message,
    setMessage,
    isButtonDisabled,
    handleKeyDown,
    throttledSendMessage,
    isMessageTooLong,
  }
}
