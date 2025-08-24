import type { PresenceState } from "./presence-face-pile"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { getTimeAgo } from "../../_utils/date"

export function PresenceAvatar({
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
