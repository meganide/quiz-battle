"use client"

import React from "react"

import { useQuery } from "convex/react"
import { Users } from "lucide-react"

import type { Id } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

import { Lobby } from "./_components/lobby"
import { usePresence } from "./_hooks/use-presence"

type RoomPageProps = {
  params: Promise<{
    inviteCode: string
  }>
}

export default function RoomPage({ params }: RoomPageProps) {
  const { inviteCode } = React.use(params)

  const user = useUser()
  const room = useQuery(api.rooms.queries.getByInviteCode, {
    inviteCode,
  })

  const presenceState = usePresence(api.presence, inviteCode, user?._id)

  const joinedPlayersPresenceState = React.useMemo(
    () =>
      presenceState?.filter((player) => {
        return room?.gamePlayerIds.includes(player.userId as Id<"users">)
      }) ?? [],
    [presenceState, room]
  )

  if (!room) {
    return (
      <section>
        <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
        <Container className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            The room you are looking for does not exist.
          </p>
        </Container>
      </section>
    )
  }

  if (room.status === "lobby") {
    return (
      <Lobby
        inviteCode={inviteCode}
        joinedPlayersPresenceState={joinedPlayersPresenceState}
        room={room}
      />
    )
  }
}
