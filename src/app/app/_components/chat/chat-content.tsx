import { useQuery } from "convex/react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "~/convex/_generated/api"

import { ChatMessage } from "./chat-message"

export function ChatContent() {
  const messages = useQuery(api.chat.queries.getMessages, {
    chatRoomId: "global_chat",
  })

  console.log(messages)

  return (
    <ScrollArea className="h-full flex-1 pr-2">
      <section className="flex flex-col">
        {messages?.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
      </section>
    </ScrollArea>
  )
}
