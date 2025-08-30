"use client"

import { Award, Medal, Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PlayerScore = {
  _id: string
  userId: string
  score: number
  correctAnswers: number
  user: {
    name: string | undefined
    image: string | undefined
  }
}

type LeaderboardProps = {
  playerScores: PlayerScore[]
  currentQuestionNumber: number
  className?: string
}

function getRankIcon(position: number) {
  switch (position) {
    case 1:
      return <Trophy className="size-5 text-yellow-500" />
    case 2:
      return <Medal className="size-5 text-gray-400" />
    case 3:
      return <Award className="size-5 text-amber-600" />
    default:
      return (
        <div className="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full text-xs font-semibold">
          {position}
        </div>
      )
  }
}

export function Leaderboard({
  playerScores,
  currentQuestionNumber,
  className,
}: LeaderboardProps) {
  return (
    <Card
      className={cn(
        "h-full max-h-[500px] min-h-0 pr-1 xl:max-h-full",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="size-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 space-y-3 overflow-y-auto pr-2 pl-6">
        {playerScores.length === 0 ? (
          <section className="text-muted-foreground py-8 text-center">
            <p className="text-sm">No scores yet...</p>
            <p className="text-xs">Be the first to answer!</p>
          </section>
        ) : (
          <section className="space-y-2">
            {playerScores.map((playerScore, index) => {
              const position = index + 1

              return (
                <article
                  key={playerScore.userId}
                  className={cn(
                    "flex max-w-sm items-center gap-3 rounded-lg border bg-neutral-400/60 p-3 transition-all duration-200 hover:shadow-sm",
                    {
                      "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:border-yellow-800 dark:from-yellow-950/20 dark:to-yellow-900/20":
                        position === 1,
                      "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:border-gray-800 dark:from-gray-950/20 dark:to-gray-900/20":
                        position === 2,
                      "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 dark:border-amber-800 dark:from-amber-950/20 dark:to-amber-900/20":
                        position === 3,
                    }
                  )}
                >
                  {/* Rank Icon */}
                  <div className="flex items-center justify-center">
                    {getRankIcon(position)}
                  </div>

                  {/* User Avatar */}
                  <Avatar
                    className={cn("size-8", {
                      "ring-2 ring-yellow-400 ring-offset-1": position === 1,
                      "ring-2 ring-gray-400 ring-offset-1": position === 2,
                      "ring-2 ring-amber-400 ring-offset-1": position === 3,
                    })}
                  >
                    <AvatarImage
                      alt={playerScore.user.name || "Player"}
                      src={playerScore.user.image}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {playerScore.user.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div
                    className={cn("min-w-0 flex-1", {
                      "text-yellow-700": position === 1,
                      "text-gray-700": position === 2,
                      "text-amber-700": position === 3,
                    })}
                  >
                    <p className={cn("truncate text-sm font-medium")}>
                      {playerScore.user.name || "Anonymous"}
                    </p>
                    <p className="text-xs">
                      {playerScore.correctAnswers}/{currentQuestionNumber}{" "}
                      correct
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      className={cn(
                        "bg-secondary text-secondary-foreground border-none text-sm font-bold",
                        {
                          "bg-yellow-500 text-yellow-50": position === 1,
                          "bg-gray-500 text-gray-50": position === 2,
                          "bg-amber-500 text-amber-50": position === 3,
                        }
                      )}
                    >
                      {playerScore.score.toLocaleString()}
                    </Badge>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </CardContent>
    </Card>
  )
}
