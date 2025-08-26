import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { JoinRoom } from "../_schemas/join-room.schema"

import { api } from "~/convex/_generated/api"
import { RoomErrorCodes } from "~/convex/rooms/errors"

import { joinRoomSchema } from "../_schemas/join-room.schema"

export function useJoinRoom() {
  const [isJoinRoomDialogOpen, setIsJoinRoomDialogOpen] = React.useState(false)
  const joinRoomMutation = useMutation(api.rooms.mutations.join)
  const router = useRouter()

  const form = useForm<JoinRoom>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      inviteCode: "",
    },
  })

  const joinRoom = React.useCallback(
    async (values: JoinRoom) => {
      try {
        await joinRoomMutation(values)
        setIsJoinRoomDialogOpen(false)
        form.reset()
        router.push(`/quiz-battles/room/${values.inviteCode}`)
      } catch (error) {
        if (error instanceof ConvexError) {
          if (error.data.code === RoomErrorCodes.ALREADY_IN_ROOM) {
            router.push(`/quiz-battles/room/${values.inviteCode}`)
            return
          }

          toast.error(error.data.message)
        } else {
          toast.error("Failed to join room")
        }
      }
    },
    [form, joinRoomMutation, router]
  )

  return {
    isJoinRoomDialogOpen,
    setIsJoinRoomDialogOpen,
    form,
    joinRoom,
  }
}
