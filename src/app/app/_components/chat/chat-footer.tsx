import { useState } from "react"

import { useMutation } from "convex/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

export function ChatFooter() {
  const [message, setMessage] = useState("")

  const sendMessageMutation = useMutation(api.chat.mutations.sendMessage)

  const isMessageEmpty = message.length === 0
  const isMessageTooLong = message.length > 280
  const isButtonDisabled = isMessageEmpty || isMessageTooLong

  async function sendMessage() {
    if (isButtonDisabled) return

    await sendMessageMutation({
      chatRoomId: "global_chat",
      message,
    })

    setMessage("")
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await sendMessage()
    }
  }

  return (
    <footer className="relative">
      <Input
        placeholder="Your message..."
        value={message}
        className={cn(
          "h-12 pr-[76px]",
          isMessageTooLong &&
            "border-red-500 outline-red-500 focus-visible:ring-red-500"
        )}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="absolute top-1/2 right-2 h-8 -translate-y-1/2 px-3"
        disabled={isButtonDisabled}
        size="sm"
        onClick={sendMessage}
      >
        Send
      </Button>
    </footer>
  )
}
