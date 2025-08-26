import React from "react"

import { useQuery } from "convex/react"
import { Loader2 } from "lucide-react"

import { useUser } from "@/hooks/use-user"
import { DEFAULT_ROOM_ID } from "@/stores/chat-store"
import { api } from "~/convex/_generated/api"

import { usePresence } from "../../quiz-battles/room/[inviteCode]/_hooks/use-presence"

type OnlineUsersProps = {
  chatRoomId: string
}

export function OnlineUsers({ chatRoomId }: OnlineUsersProps) {
  const user = useUser()

  const specificRoom = useQuery(
    api.rooms.queries.getByInviteCode,
    chatRoomId === DEFAULT_ROOM_ID ? "skip" : { inviteCode: chatRoomId }
  )

  const presenceState = usePresence(api.presence, chatRoomId, user?._id)

  const onlineUsers = React.useMemo(() => {
    return presenceState?.filter((presence) => {
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
    }).length
  }, [chatRoomId, presenceState, specificRoom?.gamePlayerIds, user?._id])

  return (
    <div className="ml-auto flex items-center gap-1">
      {onlineUsers !== undefined ? (
        <div className="mr-0.5 size-2 rounded-full bg-green-500" />
      ) : (
        <Loader2 className="size-2 animate-spin" />
      )}
      <span className="text-muted-foreground flex items-center gap-1 text-xs">
        {onlineUsers} online
      </span>
    </div>
  )
}
