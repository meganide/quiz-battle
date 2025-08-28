import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Timer } from "./timer"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  console.log("room", room)
  return (
    <Container className="flex flex-col gap-6">
      <Timer duration={20} />
      <section className="flex flex-row gap-4">
        <Card className="flex-2">
          <CardHeader>
            <CardTitle>Question</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      </section>
    </Container>
  )
}
