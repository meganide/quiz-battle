import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { api } from "~/convex/_generated/api"

import {
  type CreateRoom,
  createRoomSchema,
} from "../_schemas/create-room.schema"

export function useCreateRoom() {
  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] =
    React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)

  const createRoomMutation = useMutation(api.rooms.mutations.create)
  const router = useRouter()

  const form = useForm<CreateRoom>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      isPrivate: false,
      topic: "",
      numQuestions: 10,
      difficulty: "medium" as const,
      timePerQuestion: 30,
    },
  })

  const createRoom = React.useCallback(
    async (values: CreateRoom) => {
      try {
        setIsCreating(true)
        const result = await createRoomMutation(values)
        setIsCreateRoomDialogOpen(false)
        form.reset()
        router.push(`/room/${result.inviteCode}`)
      } catch (error) {
        if (error instanceof ConvexError) {
          toast.error(error.data.message)
        } else {
          toast.error("Failed to create room")
        }
      } finally {
        setIsCreating(false)
      }
    },
    [createRoomMutation, form, router]
  )

  return {
    isCreateRoomDialogOpen,
    setIsCreateRoomDialogOpen,
    isCreating,
    form,
    createRoom,
  }
}
