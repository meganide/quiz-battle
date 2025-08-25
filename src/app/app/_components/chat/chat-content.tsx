import { useQuery } from "convex/react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { ChatMessage } from "./chat-message"
import { useChatScroll } from "../../_hooks/use-chat-scroll"

export function ChatContent() {
  const messages = useQuery(api.chat.queries.getMessages, {
    chatRoomId: "global_chat",
  })

  const { scrollRef, handleScroll, isAtBottom, scrollToBottom } =
    useChatScroll(messages)

  return (
    <section className="relative h-full flex-1">
      <section
        ref={scrollRef}
        className={cn(
          "h-full overflow-y-auto pr-2",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        )}
        onScroll={handleScroll}
      >
        <section className="flex flex-col">
          {messages?.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))}
        </section>
      </section>

      {!isAtBottom && (
        <Button
          aria-label="Scroll to bottom"
          className="absolute right-4 bottom-4 h-8 w-8 rounded-full p-0 shadow-lg transition-all duration-200 hover:scale-105"
          size="sm"
          variant="secondary"
          onClick={() => scrollToBottom(true)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </section>
  )
}
