import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { JoinRoom } from "../_schemas/join-room.schema"

import { joinRoomSchema } from "../_schemas/join-room.schema"

export function useJoinRoom() {
  const [isJoinRoomDialogOpen, setIsJoinRoomDialogOpen] = React.useState(false)

  const form = useForm<JoinRoom>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      inviteCode: "",
    },
  })

  const joinRoom = React.useCallback((values: JoinRoom) => {
    console.log(values)
  }, [])

  return {
    isJoinRoomDialogOpen,
    setIsJoinRoomDialogOpen,
    form,
    joinRoom,
  }
}
