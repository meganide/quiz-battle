import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { formatDistanceToNow } from "date-fns"
import {
  Calendar,
  CircleQuestionMark,
  Clock,
  Eye,
  ListStart,
  Users,
} from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { Doc } from "~/convex/_generated/dataModel"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"
import { RoomErrorCodes } from "~/convex/rooms/errors"

type QuizRoomPreviewProps = {
  room: Doc<"rooms">
}

export function QuizRoomPreview({ room }: QuizRoomPreviewProps) {
  const user = useUser()
  const joinRoomMutation = useMutation(api.rooms.mutations.join)
  const router = useRouter()

  const isInRoom = !!user && room.gamePlayerIds.includes(user._id)

  function goToRoom() {
    router.push(`/app/room/${room.inviteCode}`)
  }

  async function joinRoom() {
    try {
      await joinRoomMutation({
        inviteCode: room.inviteCode,
      })
      router.push(`/app/room/${room.inviteCode}`)
    } catch (error) {
      if (error instanceof ConvexError) {
        if (error.data.code === RoomErrorCodes.ALREADY_IN_ROOM) {
          router.push(`/app/room/${room.inviteCode}`)
          return
        }

        toast.error(error.data.message)
      } else {
        toast.error("Failed to join room")
      }
    }
  }

  return (
    <motion.article
      layout
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
      className={cn(
        "bg-card rounded-lg p-6 transition-all duration-200",
        isInRoom && "border-l-primary-400 border-l-2"
      )}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <section className="flex-1">
          <h3 className="text-neutral-050 mb-2 text-xl font-bold">
            {room.name}
          </h3>
          <p className="text-neutral-200">{room.topic}</p>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <Badge className="text-xs" variant="secondary">
            {room.isPrivate ? "Private" : "Public"}
          </Badge>
          <Badge className="text-xs capitalize" variant="secondary">
            {room.status}
          </Badge>
        </section>
      </header>

      {/* Stats */}
      <section className="mb-8">
        <h4 className="mb-4 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
          Room Details
        </h4>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-neutral-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Users className="text-primary-400 size-4" />
                <span>{room.gamePlayerIds.length} players</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Players in room</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <CircleQuestionMark className="text-primary-400 size-4" />
                <span>{room.numQuestions} questions</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Number of questions</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Clock className="text-primary-400 size-4" />
                <span>{room.timePerQuestion}s each</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Time per question</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <ListStart className="text-primary-400 size-4" />
                <span className="capitalize">{room.difficulty}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Difficulty level</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary-400 size-4" />
                <span>{formatDistanceToNow(room.createdAt)} ago</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Time since creation</TooltipContent>
          </Tooltip>
        </div>
      </section>

      {/* Actions */}
      <footer className="flex items-center justify-end gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">
              <Eye />
              Spectate
            </Button>
          </TooltipTrigger>
          <TooltipContent>Spectate room</TooltipContent>
        </Tooltip>

        {isInRoom ? (
          <Button className="font-medium" onClick={goToRoom}>
            Go to room
          </Button>
        ) : (
          <Button className="font-medium" onClick={joinRoom}>
            Join room
          </Button>
        )}
      </footer>
    </motion.article>
  )
}
