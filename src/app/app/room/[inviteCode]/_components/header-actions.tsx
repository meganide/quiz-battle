import { useMutation, useQuery } from "convex/react"
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
  const joinRoomMutation = useMutation(api.rooms.mutations.join)
  const isInRoom = useQuery(api.rooms.queries.isInRoom, {
    inviteCode,
  })

  async function leaveRoom() {
    await leaveRoomMutation({
      roomId,
    })
  }

  async function joinRoom() {
    await joinRoomMutation({
      inviteCode,
    })
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
      {isInRoom ? (
        <Button variant="ghost" onClick={leaveRoom}>
          Leave Room
        </Button>
      ) : (
        <Button variant="default" onClick={joinRoom}>
          Join Room
        </Button>
      )}
    </header>
  )
}
