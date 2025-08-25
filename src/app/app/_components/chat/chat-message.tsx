import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
  id: string
  username: string
  content: string
  timestamp: Date
  avatarUrl?: string
  isOwnMessage?: boolean
}

export function ChatMessage({
  username,
  content,
  timestamp,
  avatarUrl,
  isOwnMessage = false,
}: ChatMessageProps) {
  return (
    <article
      className={cn("hover:bg-muted/50 flex gap-3 px-2 py-3 transition-colors")}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage alt={`${username}'s avatar`} src={avatarUrl} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <section className="min-w-0 flex-1">
        <header className="mb-1 flex items-baseline justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium",
              isOwnMessage ? "text-primary" : "text-foreground"
            )}
          >
            {username}
          </h4>
          <time
            className="text-muted-foreground text-xs"
            dateTime={timestamp.toISOString()}
          >
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </time>
        </header>
        <p className="text-foreground text-sm leading-relaxed break-words">
          {content}
        </p>
      </section>
    </article>
  )
}
