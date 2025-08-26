"use client"

import React from "react"

import { useQuery } from "convex/react"
import { AlertTriangle, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

import type { Id } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

  if (room === undefined) {
    return (
      <section>
        <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
        <Container className="flex flex-col items-center gap-4">
          <Spinner size="xl" />
        </Container>
      </section>
    )
  }

  if (room === null) {
    return (
      <section>
        <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
        <Container className="flex flex-col gap-4">
          <Card className="text-center">
            <CardHeader className="flex flex-col items-center">
              <AlertTriangle className="text-muted-foreground h-8 w-8" />
              <section className="space-y-2">
                <CardTitle className="text-xl">Room Not Found</CardTitle>
                <CardDescription className="max-w-sm">
                  The quiz room you&apos;re looking for doesn&apos;t exist or
                  may have been removed.
                </CardDescription>
              </section>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/app">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Quiz Battles
                </Link>
              </Button>
            </CardContent>
          </Card>
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
