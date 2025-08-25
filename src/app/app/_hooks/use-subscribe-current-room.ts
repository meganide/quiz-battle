import { useEffect } from "react"

import { useQuery } from "convex/react"

import { useChatStore } from "@/app/stores/chat-store"
import { api } from "~/convex/_generated/api"

export function useSubscribeCurrentRoom() {
  const { setChatRoomIds, setChatRoomId, resetChat } = useChatStore()
  const currentRoom = useQuery(api.rooms.queries.getCurrentRoom)

  useEffect(() => {
    if (!currentRoom) {
      resetChat()
      return
    }

    setChatRoomIds([currentRoom.inviteCode])
    setChatRoomId(currentRoom.inviteCode)
  }, [currentRoom, resetChat, setChatRoomId, setChatRoomIds])

  return currentRoom?.inviteCode
}
