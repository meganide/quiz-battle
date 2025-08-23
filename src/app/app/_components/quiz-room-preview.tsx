import type { Doc } from "~/convex/_generated/dataModel"

type QuizRoomPreviewProps = {
  room: Doc<"rooms">
}

export function QuizRoomPreview({ room }: QuizRoomPreviewProps) {
  return (
    <article className="rounded-sm bg-gradient-to-b from-neutral-400 to-neutral-500 px-3 py-6">
      <header className="flex flex-col">
        <span className="text-neutral-050 font-bold">{room.name}</span>
        <span className="text-neutral-050 font-semibold">
          {room.playerIds.length} players
        </span>
      </header>
    </article>
  )
}
