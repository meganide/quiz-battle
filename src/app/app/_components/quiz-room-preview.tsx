import { Eye } from "lucide-react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Button } from "@/components/ui/button"

type QuizRoomPreviewProps = {
  room: Doc<"rooms">
}

export function QuizRoomPreview({ room }: QuizRoomPreviewProps) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-sm bg-gradient-to-b from-neutral-400 to-neutral-500 px-3 py-6">
      <header className="flex flex-col">
        <span className="text-neutral-050 font-bold">{room.name}</span>
        <span className="text-neutral-050 font-semibold">
          {room.playerIds.length} players
        </span>
      </header>

      <aside className="flex items-center gap-2">
        <Button variant="secondary">
          <Eye className="size-5" />
        </Button>
        <Button>Join</Button>
      </aside>
    </article>
  )
}
