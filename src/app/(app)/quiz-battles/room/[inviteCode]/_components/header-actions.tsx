import { useConvexAuth, useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { Doc } from "~/convex/_generated/dataModel"

import { SignInDialog } from "@/components/sign-in-dialog"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

type HeaderActionsProps = {
  room: Doc<"rooms">
}

export function HeaderActions({ room }: HeaderActionsProps) {
  const leaveRoomMutation = useMutation(api.rooms.mutations.leave)
  const joinRoomMutation = useMutation(api.rooms.mutations.join)
  const startQuizMutation = useMutation(api.quiz.mutations.startQuiz)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isStarting = startQuizMutation === undefined

  const user = useUser()
  const { isAuthenticated } = useConvexAuth()
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
      inviteCode: room.inviteCode,
    })
  }

  async function startQuiz() {
    await startQuizMutation({
      roomId: room._id,
    })
  }

  function renderJoinButton() {
    if (isInRoom) {
      return (
        <Button
          className="flex-1 sm:w-auto"
          variant="outline"
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      )
    }

    if (!isAuthenticated) {
      return (
        <SignInDialog>
          <Button className="flex-1 sm:w-auto" variant="default">
            Join Room
          </Button>
        </SignInDialog>
      )
    }

    return (
      <Button className="flex-1 sm:w-auto" variant="default" onClick={joinRoom}>
        Join Room
      </Button>
    )
  }

  async function invitePlayers() {
    const inviteUrl = `${window.location.origin}/quiz-battles/room/${room.inviteCode}`
    await navigator.clipboard.writeText(inviteUrl)
    toast.success("Invite URL copied to clipboard")
  }

  return (
    <header className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <section className="flex w-full items-center gap-2 sm:w-auto">
        {renderJoinButton()}
        <Button
          className="flex-1 sm:w-auto"
          variant="secondary"
          onClick={invitePlayers}
        >
          Invite Players
        </Button>
      </section>
      {isHost && (
        <Button
          className="w-full sm:w-auto"
          disabled={isStarting}
          onClick={startQuiz}
        >
          {isStarting && (
            <Spinner className="text-primary-foreground" size="sm" />
          )}
          Start Quiz
        </Button>
      )}
    </header>
  )
}
