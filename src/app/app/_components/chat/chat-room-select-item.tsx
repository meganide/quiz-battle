"use client"

import { useQuery } from "convex/react"

import { DEFAULT_ROOM_ID } from "@/app/stores/chat-store"
import { SelectItem } from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

import { usePresence } from "../../room/[inviteCode]/_hooks/use-presence"

type ChatRoomSelectItemProps = {
  chatRoomId: string
}

export function ChatRoomSelectItem({ chatRoomId }: ChatRoomSelectItemProps) {
  const user = useUser()

  const specificRoom = useQuery(
    api.rooms.queries.getByInviteCode,
    chatRoomId === DEFAULT_ROOM_ID ? "skip" : { inviteCode: chatRoomId }
  )

  const presenceState = usePresence(api.presence, chatRoomId, user?._id)

  const onlineUsers =
    presenceState?.filter((presence) => {
      const isUserOnline = presence.online
      const isUserSelf = presence.userId === user?._id

      // We are in global chat - show all online users
      if (chatRoomId === DEFAULT_ROOM_ID) {
        return isUserOnline && !isUserSelf
      }

      const isUserInRoom = specificRoom?.gamePlayerIds.find(
        (id) => id === presence.userId
      )

      return isUserOnline && !isUserSelf && isUserInRoom
    }).length ?? 0

  return (
    <SelectItem
      key={chatRoomId}
      className="flex w-full items-center justify-between"
      value={chatRoomId}
    >
      <span>{chatRoomId}</span>
      <div className="ml-auto flex items-center gap-1">
        <div className="size-2 rounded-full bg-green-500" />
        <span className="text-muted-foreground text-xs">
          {onlineUsers} online
        </span>
      </div>
    </SelectItem>
  )
}
