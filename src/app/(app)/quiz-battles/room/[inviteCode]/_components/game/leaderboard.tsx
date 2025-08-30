"use client"

import { useQuery } from "convex/react"
import { Award, CheckCircle, Clock, Medal, Trophy, XCircle } from "lucide-react"

import type { Doc, Id } from "~/convex/_generated/dataModel"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

type LeaderboardProps = {
  gameState: Doc<"gameStates">
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

export function Leaderboard({ className, gameState }: LeaderboardProps) {
  const playerScores = useQuery(api.quiz.queries.getPlayerScores, {
    gameStateId: gameState._id,
  })

  const isScorePhase = gameState.phase === "score"

  const currentQuestion = useQuery(api.quiz.queries.getCurrentQuestion, {
    gameStateId: gameState._id,
  })

  // Get player answers for the current question when showing results
  const playerAnswers = useQuery(
    api.quiz.queries.getPlayerAnswersForQuestion,
    isScorePhase && currentQuestion?.id
      ? { questionId: currentQuestion.id, gameStateId: gameState._id }
      : "skip"
  )

  // Get player submission status for the current question during question phase
  const submittedUserIds = useQuery(
    api.quiz.queries.getSubmittedUserIds,
    !isScorePhase ? { gameStateId: gameState._id } : "skip"
  )

  const currentQuestionNumber = getCurrentQuestionNumber()

  // Helper function to get player's answer status for current question
  const getPlayerAnswerStatus = (userId: Id<"users">) => {
    if (!isScorePhase || !playerAnswers) return null

    const playerAnswer = playerAnswers.find(
      (answer) => answer.userId === userId
    )
    return playerAnswer?.isCorrect ?? null
  }

  function hasUserSubmitted(userId: Id<"users">) {
    if (!submittedUserIds) return false

    return submittedUserIds.includes(userId)
  }

  function getCurrentQuestionNumber() {
    if (currentQuestion === undefined) return 0
    if (currentQuestion.index === 0) return 0
    return currentQuestion.index - 1
  }

  return (
    <Card
      className={cn(
        "h-full max-h-[500px] min-h-0 gap-5 pr-1 xl:h-fit xl:max-h-full",
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
          <section className="flex flex-col gap-2 pt-1">
            {playerScores?.map((playerScore, index) => {
              const position = index + 1
              const answerStatus = getPlayerAnswerStatus(playerScore.userId)
              const hasSubmitted = hasUserSubmitted(playerScore.userId)

              return (
                <article
                  key={playerScore.userId}
                  className={cn(
                    "relative flex max-w-sm items-center gap-3 rounded-lg bg-neutral-400/60 p-3 transition-all duration-200 hover:shadow-sm",
                    {
                      "bg-gradient-to-r from-yellow-50 to-yellow-100":
                        position === 1,
                      "bg-gradient-to-r from-gray-50 to-gray-100":
                        position === 2,
                      "bg-gradient-to-r from-amber-50 to-amber-100":
                        position === 3,
                      // Results phase visual feedback - enhanced backgrounds
                      "bg-gradient-to-r from-green-100 to-green-200":
                        isScorePhase && answerStatus === true,
                      "bg-gradient-to-r from-red-100 to-red-200":
                        isScorePhase && answerStatus === false,
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
                  {isScorePhase && answerStatus !== null && (
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

                  {/* Submission Status Overlay Icon for Question Phase */}
                  {!isScorePhase && (
                    <div className="absolute -top-1 -right-1">
                      {hasSubmitted ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white shadow-md">
                          <Clock className="h-4 w-4" />
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
