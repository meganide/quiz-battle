"use client"

import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "framer-motion"
import { Users } from "lucide-react"

import { Spinner } from "@/components/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "~/convex/_generated/api"

import { CreateRoomDialog } from "./create-room-dialog"
import { QuizRoomPreview } from "./quiz-room-preview"

export function QuizRoomsList() {
  const roomsInfo = useQuery(api.rooms.queries.list)

  if (roomsInfo === undefined) {
    return (
      <div className="mt-4 flex justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (roomsInfo.rooms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Users className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">No Quiz Battles Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            There are no public quiz battles available right now. Create your
            own battle to challenge others!
          </p>
          <div className="mt-6">
            <CreateRoomDialog />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {roomsInfo.rooms.map((room) => (
          <motion.div
            key={room._id}
            layout
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
          >
            <QuizRoomPreview room={room} />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  )
}
