"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type PresenceState = {
  userId: string
  online: boolean
  lastDisconnected: number
  name?: string
  image?: string
}

type FacePileProps = {
  presenceState: PresenceState[]
  className?: string
}

export function FacePile({ presenceState, className }: FacePileProps) {
  const visible = presenceState.slice(0, 5)
  const hidden = presenceState.slice(5)

  if (presenceState.length === 0) {
    return null
  }

  return (
    <section className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {visible.map((presence, index) => (
          <PresenceAvatar
            key={presence.userId}
            index={index}
            presence={presence}
            total={visible.length}
          />
        ))}
        {hidden.length > 0 && <MoreUsersPopover users={hidden} />}
      </div>
    </section>
  )
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = Math.floor((now - timestamp) / 1000)

  if (diff < 60) return "Last seen just now"
  if (diff < 3600) return `Last seen ${Math.floor(diff / 60)} min ago`
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`
  }
  const days = Math.floor(diff / 86400)
  return `Last seen ${days} day${days === 1 ? "" : "s"} ago`
}

function PresenceAvatar({
  presence,
  index,
  total,
}: {
  presence: PresenceState
  index: number
  total: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{ zIndex: total - index }}
          className={cn(
            "relative transition-transform hover:-translate-y-0.5",
            index > 0 && "-ml-2"
          )}
        >
          <Avatar
            className={cn(
              "size-8 border-2 transition-colors",
              presence.online ? "border-green-500" : "border-border"
            )}
          >
            <AvatarImage
              alt={presence.name || presence.userId}
              className={cn(!presence.online && "opacity-40")}
              src={presence.image}
            />
            <AvatarFallback
              className={cn("text-sm", !presence.online && "opacity-40")}
            >
              😊
            </AvatarFallback>
          </Avatar>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <div className="text-xs font-medium">
            {presence.name || presence.userId}
          </div>
          <div className="text-muted-foreground text-xs">
            {presence.online
              ? "Online now"
              : getTimeAgo(presence.lastDisconnected)}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function MoreUsersPopover({ users }: { users: PresenceState[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative -ml-2 transition-transform hover:-translate-y-0.5">
          <Avatar className="border-border size-8 cursor-pointer border-2">
            <AvatarFallback className="text-muted-foreground bg-muted text-xs font-medium">
              +{users.length}
            </AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          {users.slice(0, 10).map((presence) => (
            <div
              key={presence.userId}
              className="hover:bg-accent flex items-center gap-2 rounded-md p-2"
            >
              <Avatar className="size-6">
                <AvatarImage
                  alt={presence.name || presence.userId}
                  className={cn(!presence.online && "opacity-40")}
                  src={presence.image}
                />
                <AvatarFallback
                  className={cn("text-xs", !presence.online && "opacity-40")}
                >
                  😊
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {presence.name || presence.userId}
                </div>
                <div className="text-muted-foreground text-xs">
                  {presence.online
                    ? "Online now"
                    : getTimeAgo(presence.lastDisconnected)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
