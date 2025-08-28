import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { Doc } from "~/convex/_generated/dataModel"

import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

type HeaderActionsProps = {
  inviteCode: string
  room: Doc<"rooms">
}

export function HeaderActions({ inviteCode, room }: HeaderActionsProps) {
  const leaveRoomMutation = useMutation(api.rooms.mutations.leave)
  const joinRoomMutation = useMutation(api.rooms.mutations.join)
  const user = useUser()
  const router = useRouter()
  const isInRoom = !!user && room.gamePlayerIds.includes(user._id)
  const isHost = room.hostId === user?._id

  function leaveRoom() {
    const isLastPlayer = room.gamePlayerIds.length === 1
    if (isLastPlayer) {
      router.push("/quiz-battles")
    }

    // This is a workaround to avoid the race condition where the user leaves the room and the room is deleted before the user is redirected to the home page
    setTimeout(() => {
      void leaveRoomMutation({
        inviteCode: room.inviteCode,
      })
    }, 350)
  }

  async function joinRoom() {
    await joinRoomMutation({
      inviteCode,
    })
  }

  async function invitePlayers() {
    const inviteUrl = `${window.location.origin}/quiz-battles/room/${inviteCode}`
    await navigator.clipboard.writeText(inviteUrl)
    toast.success("Invite URL copied to clipboard")
  }

  return (
    <header className="flex items-center justify-between gap-2">
      <section className="flex items-center gap-2">
        {isInRoom ? (
          <Button variant="outline" onClick={leaveRoom}>
            Leave Room
          </Button>
        ) : (
          <Button variant="default" onClick={joinRoom}>
            Join Room
          </Button>
        )}
        <Button variant="secondary" onClick={invitePlayers}>
          Invite Players
        </Button>
      </section>
      {isHost && <Button>Start Quiz</Button>}
    </header>
  )
}
