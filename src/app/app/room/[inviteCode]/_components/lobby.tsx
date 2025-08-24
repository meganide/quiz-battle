import {
  Brain,
  Clock,
  Crown,
  Globe,
  Hash,
  Lock,
  Target,
  Trophy,
  Users,
} from "lucide-react"

import type { PresenceState } from "../_types"
import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
    <Container className="flex flex-col gap-6">
      {/* Header with Room Title and Actions */}
      <header className="flex flex-col gap-4">
        <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
        <HeaderActions inviteCode={inviteCode} room={room} />
      </header>

      {/* Room Information Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Room Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-muted-foreground size-5" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-foreground font-semibold">{room.name}</h3>
              <p className="text-muted-foreground text-sm">Room Name</p>
            </div>
            <div className="flex items-center gap-2">
              {room.isPrivate ? (
                <Lock className="text-muted-foreground size-4" />
              ) : (
                <Globe className="text-muted-foreground size-4" />
              )}
              <span className="text-sm">
                {room.isPrivate ? "Private Room" : "Public Room"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="text-muted-foreground size-4" />
              <span className="font-mono text-sm">{inviteCode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Game Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-muted-foreground size-5" />
              Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-foreground font-medium">{room.topic}</p>
              <p className="text-muted-foreground text-sm">Topic</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Difficulty</span>
              <Badge variant="secondary">
                {room.difficulty.charAt(0).toUpperCase() +
                  room.difficulty.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-muted-foreground size-4" />
              <span className="text-sm">
                {room.numQuestions} Question{room.numQuestions !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground size-4" />
              <span className="text-sm">
                {room.timePerQuestion}s per question
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Players Card */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-muted-foreground size-5" />
              Players ({joinedPlayersPresenceState.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[250px] flex-col">
            {joinedPlayersPresenceState.length > 0 ? (
              <div className="flex h-full flex-col gap-4">
                <PresenceFacePile
                  hostId={room.hostId}
                  presenceState={joinedPlayersPresenceState}
                />
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid gap-2">
                    {joinedPlayersPresenceState.map((player, index) => (
                      <div
                        key={`${player.userId}-${index}`}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div
                          className={cn("size-2 rounded-full", {
                            "bg-green-500": player.online,
                            "bg-neutral-400": !player.online,
                          })}
                        />
                        <span className="flex-1 truncate">
                          {player.name || "Anonymous Player"}
                        </span>
                        {player.userId === room.hostId && (
                          <Crown className="size-4 text-yellow-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-center">
                <Users className="mx-auto mb-2 size-8 opacity-50" />
                <p className="text-sm">No players have joined yet</p>
                <p className="text-xs">Share the invite code to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Status Section */}
      <section className="border-border bg-muted/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium">Waiting in Lobby</span>
          </div>
          <Badge variant="outline">
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          The game will start once the host is ready and there are enough
          players.
        </p>
      </section>
    </Container>
  )
}
