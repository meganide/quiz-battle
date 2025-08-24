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
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        "flex items-center justify-between gap-4 rounded-sm bg-gradient-to-b from-neutral-400 to-neutral-500 px-4 py-6",
        isInRoom && "border-primary border-l-4"
      )}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <section className="flex w-full flex-col gap-1">
        <section className="flex w-full items-center justify-between">
          <span className="text-neutral-050 text-lg font-bold">
            {room.name}
          </span>
          <Badge className="bg-secondary-800 text-secondary-200 font-semibold tracking-wider">
            {room.status.toUpperCase()}
          </Badge>
        </section>
        <section className="flex items-center justify-between gap-4">
          <section className="flex w-full flex-col items-start gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="max-w-full overflow-hidden text-base text-ellipsis whitespace-nowrap">
                  {room.topic}
                </p>
              </TooltipTrigger>
              <TooltipContent>Topic</TooltipContent>
            </Tooltip>
            <article className="flex items-center gap-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Users className="size-4 stroke-3 text-neutral-200" />
                    <span>{room.gamePlayerIds.length}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Players</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <CircleQuestionMark className="size-4 stroke-3 text-neutral-200" />
                    <span>{room.numQuestions}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Questions</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4 stroke-3 text-neutral-200" />
                    <span>{room.timePerQuestion}s</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Time per question</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <ListStart className="size-4 stroke-3 text-neutral-200" />
                    <span>
                      {room.difficulty.charAt(0).toUpperCase() +
                        room.difficulty.slice(1)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Difficulty</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4 stroke-3 text-neutral-200" />
                    <span>{formatDistanceToNow(room.createdAt)} ago</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Time since creation</TooltipContent>
              </Tooltip>
            </article>
          </section>
          <aside className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">
                  <Eye className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Spectate</TooltipContent>
            </Tooltip>
            {isInRoom ? (
              <Button onClick={goToRoom}>Go to room</Button>
            ) : (
              <Button onClick={joinRoom}>Join</Button>
            )}
          </aside>
        </section>
      </section>
    </motion.article>
  )
}
