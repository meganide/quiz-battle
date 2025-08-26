import { useEffect } from "react"

import { useQuery } from "convex/react"

import { useChatStore } from "@/app/stores/chat-store"
import { api } from "~/convex/_generated/api"

export function useSubscribeCurrentRoom() {
  const { setChatRoomIds, resetChat } = useChatStore()
  const currentRoom = useQuery(api.rooms.queries.getCurrentRoom)

  useEffect(() => {
    if (!currentRoom) {
      resetChat()
      return
    }

    setChatRoomIds([currentRoom.inviteCode])
  }, [currentRoom, resetChat, setChatRoomIds])

  return currentRoom
}
