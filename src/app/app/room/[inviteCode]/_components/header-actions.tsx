"use client"

import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { Id } from "~/convex/_generated/dataModel"

import { Button } from "@/components/ui/button"
import { api } from "~/convex/_generated/api"

type HeaderActionsProps = {
  inviteCode: string
  roomId: Id<"rooms">
}

export function HeaderActions({ inviteCode, roomId }: HeaderActionsProps) {
  const leaveRoomMutation = useMutation(api.rooms.mutations.leave)
  const router = useRouter()

  async function leaveRoom() {
    await leaveRoomMutation({
      roomId,
    })

    router.push("/app")
  }

  async function invitePlayers() {
    const inviteUrl = `${window.location.origin}/app/room/${inviteCode}`
    await navigator.clipboard.writeText(inviteUrl)
    toast.success("Invite URL copied to clipboard")
  }

  return (
    <header className="ml-auto flex items-center gap-2">
      <Button variant="secondary" onClick={invitePlayers}>
        Invite Players
      </Button>
      <Button variant="ghost" onClick={leaveRoom}>
        Leave Room
      </Button>
    </header>
  )
}
