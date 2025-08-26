import React from "react"

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

import { useChatStore } from "@/app/stores/chat-store"
import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  const { setChatRoomId } = useChatStore()

  React.useEffect(() => {
    setChatRoomId(inviteCode)
  }, [inviteCode, setChatRoomId])

  return (
    <section>
      <HeaderTitle href="/app" Icon={Users} title="Quiz Battle Room" />
      <Container className="flex flex-col gap-6">
        <HeaderActions inviteCode={inviteCode} room={room} />
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-muted-foreground size-5" />
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Room Name
                </p>
                <h3 className="text-foreground text-sm font-semibold">
                  {room.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {room.isPrivate ? (
                      <Lock className="size-4 text-red-500" />
                    ) : (
                      <Globe className="size-4 text-green-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {room.isPrivate
                      ? "This is a private room - only players with the invite code can join"
                      : "This is a public room - the room is visible to everyone"}
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium">
                  {room.isPrivate ? "Private Room" : "Public Room"}
                </span>
              </div>
              <div className="bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                  Invite Code
                </p>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Hash className="text-muted-foreground size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Share this code with others to invite them to the room
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-foreground font-mono text-lg font-bold tracking-wider">
                    {inviteCode}
                  </span>
                </div>
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
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Topic
                </p>
                <p className="text-foreground text-sm font-semibold">
                  {room.topic}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs tracking-wide uppercase">
                  Difficulty
                </span>
                <Badge
                  className="font-semibold tracking-wide"
                  variant="secondary"
                >
                  {room.difficulty.toLocaleUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Target className="size-4 text-green-600 dark:text-green-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Total number of questions in this quiz
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-sm">
                    <span className="font-semibold">{room.numQuestions}</span>{" "}
                    Question{room.numQuestions !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Time limit for answering each question
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-sm">
                    <span className="font-semibold">
                      {room.timePerQuestion}s
                    </span>{" "}
                    per question
                  </span>
                </div>
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
              <div className="flex h-full flex-col gap-4">
                <PresenceFacePile
                  hostId={room.hostId}
                  presenceState={joinedPlayersPresenceState}
                />
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid">
                    {joinedPlayersPresenceState.map((player, index) => (
                      <div
                        key={`${player.userId}-${index}`}
                        className="flex items-center gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-neutral-400"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "border-background size-3 rounded-full border-2 shadow-sm",
                                {
                                  "bg-green-500": player.online,
                                  "bg-neutral-400": !player.online,
                                }
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {player.online
                              ? "Player is online and active in the room"
                              : "Player is online, but not active in the room"}
                          </TooltipContent>
                        </Tooltip>
                        <span className="flex-1 truncate font-medium">
                          {player.name || "Anonymous Player"}
                        </span>
                        {player.userId === room.hostId && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Crown className="size-4 text-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Room Host - can start the game
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Status Section */}
        <section className="border-border bg-muted/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="size-3 animate-pulse rounded-full bg-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>Game status indicator</TooltipContent>
              </Tooltip>
              <span className="text-sm font-semibold">Waiting in Lobby</span>
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
    </section>
  )
}
