"use client"

import { useQuery } from "convex/react"
import { Award, CheckCircle, Medal, Trophy, XCircle } from "lucide-react"

import type { Id } from "~/convex/_generated/dataModel"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

type LeaderboardProps = {
  currentQuestionNumber: number
  className?: string
  gameStateId: Id<"gameStates">
  showResults?: boolean
  currentQuestionId?: Id<"questions">
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
  currentQuestionNumber,
  className,
  gameStateId,
  showResults = false,
  currentQuestionId,
}: LeaderboardProps) {
  const playerScores = useQuery(api.quiz.queries.getPlayerScores, {
    gameStateId: gameStateId,
  })

  // Get player answers for the current question when showing results
  const playerAnswers = useQuery(
    api.quiz.queries.getPlayerAnswersForQuestion,
    showResults && currentQuestionId
      ? { questionId: currentQuestionId }
      : "skip"
  )

  // Helper function to get player's answer status for current question
  const getPlayerAnswerStatus = (userId: Id<"users">) => {
    if (!showResults || !playerAnswers) return null

    const playerAnswer = playerAnswers.find(
      (answer) => answer.userId === userId
    )
    return playerAnswer?.isCorrect ?? null
  }

  return (
    <Card
      className={cn(
        "h-full max-h-[500px] min-h-0 pr-1 xl:h-fit xl:max-h-full",
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
        {playerScores?.length === 0 ? (
          <section className="text-muted-foreground py-8 text-center">
            <p className="text-sm">No scores yet...</p>
            <p className="text-xs">Be the first to answer!</p>
          </section>
        ) : (
          <section className="flex flex-col gap-2">
            {playerScores?.map((playerScore, index) => {
              const position = index + 1
              const answerStatus = getPlayerAnswerStatus(playerScore.userId)

              return (
                <article
                  key={playerScore.userId}
                  className={cn(
                    "relative flex max-w-sm items-center gap-3 rounded-lg border-2 bg-neutral-400/60 p-3 transition-all duration-200 hover:shadow-sm",
                    {
                      "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:border-yellow-800 dark:from-yellow-950/20 dark:to-yellow-900/20":
                        position === 1,
                      "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:border-gray-800 dark:from-gray-950/20 dark:to-gray-900/20":
                        position === 2,
                      "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 dark:border-amber-800 dark:from-amber-950/20 dark:to-amber-900/20":
                        position === 3,
                      // Results phase visual feedback - enhanced backgrounds
                      "border-green-300 bg-gradient-to-r from-green-100 to-green-200 dark:border-green-700":
                        showResults && answerStatus === true,
                      "border-red-300 bg-gradient-to-r from-red-100 to-red-200":
                        showResults && answerStatus === false,
                    }
                  )}
                >
                  {/* Rank Icon */}
                  {getRankIcon(position)}

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

                  {/* Score and Answer Status */}
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

                  {/* Answer Status Overlay Icon */}
                  {showResults && answerStatus !== null && (
                    <div className="absolute -top-1 -right-1">
                      {answerStatus ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                          <XCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </section>
        )}
      </CardContent>
    </Card>
  )
}
