"use client"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { Spinner } from "@/components/spinner"
import { api } from "~/convex/_generated/api"

import { GameLoop } from "./game-loop"
import { StartingLoader } from "./starting-loader"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  const gameState = useQuery(api.quiz.queries.getGameState, {
    roomId: room._id,
  })

  if (!gameState) {
    return (
      <Container className="flex h-full items-center justify-center">
        <Spinner size="xl" />
      </Container>
    )
  }

  if (gameState.phase === "starting") {
    return (
      <StartingLoader />
    )
  }

  return <GameLoop gameState={gameState} room={room} />
}
