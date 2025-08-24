"use client"

import React from "react"

import usePresence from "@convex-dev/presence/react"
import { useQuery } from "convex/react"
import { Users } from "lucide-react"

import type { Id } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

import { HeaderActions } from "./_components/header-actions"
import { PresenceFacePile } from "./_components/presence-face-pile/presence-face-pile"

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

  const presenceState = usePresence(api.presence, inviteCode, user?._id ?? "")
  const joinedPlayersPresenceState = React.useMemo(
    () =>
      presenceState?.filter((player) => {
        return room?.onlinePlayerIds.includes(player.userId as Id<"users">)
      }) ?? [],
    [presenceState, room]
  )

  if (!room) {
    return (
      <Container className="flex flex-col gap-4">
        <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
        <p className="text-muted-foreground text-sm">
          The room you are looking for does not exist.
        </p>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-4">
      <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
      <HeaderActions inviteCode={inviteCode} room={room} />
      <PresenceFacePile presenceState={joinedPlayersPresenceState} />
    </Container>
  )
}
