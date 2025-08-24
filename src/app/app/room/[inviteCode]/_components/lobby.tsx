import { Users } from "lucide-react"

import type { PresenceState } from "../_types"
import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"

import { HeaderActions } from "./header-actions"
import { PresenceFacePile } from "./presence-face-pile/presence-face-pile"

type LobbyProps = {
  inviteCode: string
  room: Doc<"rooms">
  joinedPlayersPresenceState: PresenceState[]
}

export function Lobby({
  inviteCode,
  room,
  joinedPlayersPresenceState,
}: LobbyProps) {
  return (
    <Container className="flex flex-col gap-4">
      <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
      <HeaderActions inviteCode={inviteCode} room={room} />
      <PresenceFacePile presenceState={joinedPlayersPresenceState} />
    </Container>
  )
}
