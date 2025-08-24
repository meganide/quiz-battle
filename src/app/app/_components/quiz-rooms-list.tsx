"use client"

import { useQuery } from "convex/react"
import { AnimatePresence } from "motion/react"

import { api } from "~/convex/_generated/api"

import { QuizRoomPreview } from "./quiz-room-preview"

export function QuizRoomsList() {
  const publicRooms = useQuery(api.rooms.queries.getPublicRooms)

  if (!publicRooms) return <p>No public rooms found</p>

  return (
    <section className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {publicRooms.map((room) => (
          <QuizRoomPreview key={room._id} room={room} />
        ))}
      </AnimatePresence>
    </section>
  )
}
