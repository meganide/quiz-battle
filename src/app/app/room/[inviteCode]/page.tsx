"use client"

import React from "react"

import { useQuery } from "convex/react"
import { Users } from "lucide-react"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { api } from "~/convex/_generated/api"

import { HeaderActions } from "./_components/header-actions"

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

  if (!room) {
    return (
      <Container className="flex flex-col gap-4">
        <HeaderTitle Icon={Users} title="Quiz Battle Room" />
        <p className="text-muted-foreground text-sm">
          The room you are looking for does not exist.
        </p>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-4">
      <HeaderTitle Icon={Users} title="Quiz Battle Room" />
      <HeaderActions inviteCode={inviteCode} room={room} />
    </Container>
  )
}
