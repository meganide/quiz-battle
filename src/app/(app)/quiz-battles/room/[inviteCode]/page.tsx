"use client"

import React from "react"

import { useQuery } from "convex/react"
import { Users } from "lucide-react"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Spinner } from "@/components/spinner"
import { api } from "~/convex/_generated/api"

import { Lobby } from "./_components/lobby"
import { RoomDoesntExist } from "./_components/room-doesnt-exist"

type RoomPageProps = {
  params: Promise<{
    inviteCode: string
  }>
}

export default function RoomPage({ params }: RoomPageProps) {
  const { inviteCode } = React.use(params)

  const room = useQuery(api.rooms.queries.getByInviteCode, {
    inviteCode,
  })

  if (room === undefined) {
    return (
      <section>
        <HeaderTitle
          href="/quiz-battles"
          Icon={Users}
          title="Quiz Battle Room"
        />
        <Container className="flex flex-col items-center gap-4">
          <Spinner size="xl" />
        </Container>
      </section>
    )
  }

  if (room === null) {
    return <RoomDoesntExist />
  }

  if (room.status === "lobby") {
    return <Lobby inviteCode={inviteCode} room={room} />
  }
}
