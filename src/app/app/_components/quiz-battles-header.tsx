"use client"

import { useQuery } from "convex/react"

import { api } from "~/convex/_generated/api"

import { CreateRoomDialog } from "./create-room-dialog"
import { JoinRoomDialog } from "./join-room-dialog"

export function QuizBattlesHeader() {
  const publicRooms = useQuery(api.rooms.queries.getPublicRooms)

  return (
    <section className="flex w-full items-center justify-between">
      <aside>
        <article className="flex items-center gap-4 rounded-sm bg-neutral-500 px-3 py-2">
          <span>Live Games</span>
          <span className="text-neutral-050 font-bold">
            {publicRooms?.length ?? 0}
          </span>
        </article>
      </aside>
      <div className="flex items-center gap-4">
        <JoinRoomDialog />
        <CreateRoomDialog />
      </div>
    </section>
  )
}
