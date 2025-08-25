import { formatDistanceToNow } from "date-fns"

import type { ChatMessage } from "~/convex/chat/types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
  message: ChatMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <article
      className={cn("hover:bg-accent flex gap-3 px-2 py-3 transition-colors")}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage
          alt={`${message.author.name}'s avatar`}
          src={message.author.image}
        />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {message.author.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <section className="min-w-0 flex-1">
        <header className="mb-1 flex items-baseline justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium",
              message.isOwnMessage ? "text-primary" : "text-foreground"
            )}
          >
            {message.author.name}
          </h4>
          <time
            className="text-muted-foreground text-xs"
            dateTime={message._creationTime.toString()}
          >
            {formatDistanceToNow(message._creationTime, { addSuffix: true })}
          </time>
        </header>
        <p className="text-foreground text-sm leading-relaxed break-words">
          {message.content}
        </p>
      </section>
    </article>
  )
}
