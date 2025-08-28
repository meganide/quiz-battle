import type { Doc } from "~/convex/_generated/dataModel"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  console.log("room", room)
  return <div>game</div>
}
