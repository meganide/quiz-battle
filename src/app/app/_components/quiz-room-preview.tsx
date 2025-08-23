import type { Doc } from "~/convex/_generated/dataModel"

type QuizRoomPreviewProps = {
  room: Doc<"rooms">
}

export function QuizRoomPreview({ room }: QuizRoomPreviewProps) {
  return (
    <article className="rounded-sm bg-gradient-to-b from-neutral-400 to-neutral-500 px-3 py-6">
      <span className="text-neutral-050 font-semibold">{room.name}</span>
    </article>
  )
}
