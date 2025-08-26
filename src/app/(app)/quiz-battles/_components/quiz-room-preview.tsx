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
    router.push(`/room/${room.inviteCode}`)
  }

  async function joinRoom() {
    try {
      await joinRoomMutation({
        inviteCode: room.inviteCode,
      })
      router.push(`/room/${room.inviteCode}`)
    } catch (error) {
      if (error instanceof ConvexError) {
        if (error.data.code === RoomErrorCodes.ALREADY_IN_ROOM) {
          router.push(`/room/${room.inviteCode}`)
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
        "bg-card flex flex-col gap-6 rounded-lg p-6 transition-all duration-200",
        isInRoom && "border-l-primary-400 border-l-2"
      )}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {/* Header */}
      <header>
        <section className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                Room Name
              </h4>
              <h3 className="text-neutral-050 text-base font-bold">
                {room.name}
              </h3>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                Topic
              </h4>
              <p className="leading-4 text-neutral-100">{room.topic}</p>
            </div>

            <RoomBadges className="md:hidden" room={room} />
          </div>

          <RoomBadges className="hidden md:flex" room={room} />
        </section>
      </header>

      {/* Stats */}
      <section className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
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
                <span>{formatDistanceToNow(room._creationTime)} ago</span>
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

type RoomBadgesProps = {
  room: Doc<"rooms">
  className?: string
}

function RoomBadges({ room, className }: RoomBadgesProps) {
  return (
    <section className={cn("flex flex-wrap items-center gap-2", className)}>
      <Badge className="bg-neutral-600 text-xs text-neutral-100">
        {room.isPrivate ? "Private" : "Public"}
      </Badge>
      <Badge className="bg-neutral-600 text-xs text-neutral-100 capitalize">
        {room.status}
      </Badge>
    </section>
  )
}
