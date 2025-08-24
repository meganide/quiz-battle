"use client"

import React from "react"

import { useQuery } from "convex/react"
import { AnimatePresence } from "motion/react"

import type { Doc, Id } from "~/convex/_generated/dataModel"

import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

import { QuizRoomPreview } from "./quiz-room-preview"

export function QuizRoomsList() {
  const user = useUser()
  const publicRooms = useQuery(api.rooms.queries.getPublicRooms)
  const sortedRooms = React.useMemo(() => {
    if (!user) return []
    return sortRoomsByCreationDate(publicRooms ?? [], user._id)
  }, [publicRooms, user])

  if (!publicRooms) return <p>No public rooms found</p>

  return (
    <section className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {sortedRooms.map((room) => (
          <QuizRoomPreview key={room._id} room={room} />
        ))}
      </AnimatePresence>
    </section>
  )
}

function sortRoomsByCreationDate(rooms: Doc<"rooms">[], userId: Id<"users">) {
  return [...rooms].sort((a, b) => {
    const aIsCurrentRoom = a.onlinePlayerIds.includes(userId)
    const bIsCurrentRoom = b.onlinePlayerIds.includes(userId)

    // If one is current room and other is not, current room goes first
    if (aIsCurrentRoom && !bIsCurrentRoom) return -1
    if (!aIsCurrentRoom && bIsCurrentRoom) return 1

    // If both are current room or both are not, sort by creation date (newest first)
    return b._creationTime - a._creationTime
  })
}
