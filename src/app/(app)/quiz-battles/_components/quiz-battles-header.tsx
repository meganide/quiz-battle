"use client"

import { useQuery } from "convex/react"

import { api } from "~/convex/_generated/api"

import { CreateRoomDialog } from "./create-room-dialog"
import { JoinRoomDialog } from "./join-room-dialog"

export function QuizBattlesHeader() {
  const roomsInfo = useQuery(api.rooms.queries.list)

  return (
    <section className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
      <aside className="order-2 md:order-1">
        <article className="flex items-center gap-2 rounded-sm bg-neutral-500 px-3 py-2 text-sm md:gap-4 md:text-base">
          <span>Live Games</span>
          <span className="text-neutral-050 font-bold">
            {roomsInfo?.numberOfActiveRooms ?? 0}
          </span>
        </article>
      </aside>
      <div className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:items-center md:gap-4">
        <JoinRoomDialog />
        <CreateRoomDialog />
      </div>
    </section>
  )
}
