import type { PresenceState } from "./presence-face-pile"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { getTimeAgo } from "../../_utils/date"

export function MoreUsersPopover({ users }: { users: PresenceState[] }) {
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
