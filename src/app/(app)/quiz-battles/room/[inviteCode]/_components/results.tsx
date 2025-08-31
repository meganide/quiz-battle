"use client"

import { useQuery } from "convex/react"
import {
  Award,
  Calendar,
  CheckCircle,
  Crown,
  Medal,
  Target,
  Timer,
  Trophy,
  Users,
  XCircle,
} from "lucide-react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Spinner } from "@/components/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

type ResultsProps = {
  room: Doc<"rooms">
}

export function Results({ room }: ResultsProps) {
  const gameResults = useQuery(api.quiz.queries.getGameResults, {
    gameStateId: room.currentGameStateId!,
  })

  function formatDuration(startTime: number, endTime: number) {
    const duration = Math.floor((endTime - startTime) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }

  function getRankIcon(position: number) {
    switch (position) {
      case 1:
        return <Trophy className="size-5 text-yellow-500 sm:size-6" />
      case 2:
        return <Medal className="size-5 text-gray-400 sm:size-6" />
      case 3:
        return <Award className="size-5 text-amber-600 sm:size-6" />
      default:
        return (
          <div className="bg-muted text-muted-foreground flex size-5 items-center justify-center rounded-full text-xs font-bold sm:size-6 sm:text-sm">
            {position}
          </div>
        )
    }
  }

  const gameDuration =
    room.startedAt && room.completedAt
      ? formatDuration(room.startedAt, room.completedAt)
      : "Unknown"

  if (!gameResults) {
    return (
      <section>
        <HeaderTitle href="/quiz-battles" Icon={Trophy} title="Quiz Results" />
        <Container className="flex flex-col items-center justify-center gap-3 py-3">
          <Spinner size="xl" />
        </Container>
      </section>
    )
  }

  return (
    <section className="min-h-screen pb-8">
      <HeaderTitle href="/quiz-battles" Icon={Trophy} title="Quiz Results" />

      <Container className="space-y-6 sm:space-y-8">
        {/* Game Overview - Simplified */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Crown className="text-primary size-6" />
              Game Overview
            </CardTitle>
            <CardDescription className="text-base">
              Game statistics and details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {/* Room Name */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Crown className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Room
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {room.name}
                    </p>
                  </div>
                </div>
              </article>

              {/* Topic */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Target className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Topic
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {room.topics}
                    </p>
                  </div>
                </div>
              </article>

              {/* Time per Question */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Timer className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Time/Question
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {room.timePerQuestion}s
                    </p>
                  </div>
                </div>
              </article>

              {/* Duration */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Duration
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {gameDuration}
                    </p>
                  </div>
                </div>
              </article>

              {/* Players */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Players
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {gameResults.playerScores.length}
                    </p>
                  </div>
                </div>
              </article>

              {/* Number of Questions */}
              <article className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-primary text-primary-foreground w-fit rounded-lg p-2">
                    <Target className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Questions
                    </p>
                    <p className="text-sm font-bold sm:text-base">
                      {room.numQuestions}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </CardContent>
        </Card>

        {/* Final Leaderboard - Smaller for mobile */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Trophy className="size-6 text-yellow-500" />
              Final Leaderboard
            </CardTitle>
            <CardDescription className="text-base">
              Final scores and rankings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <section className="space-y-2 sm:space-y-3">
              {gameResults.playerScores.map((playerScore, index) => {
                const position = index + 1
                return (
                  <article
                    key={playerScore.userId}
                    className={cn(
                      "relative flex items-center gap-2 rounded-lg p-3 transition-all duration-200 hover:shadow-sm sm:gap-4 sm:p-4",
                      {
                        "bg-gradient-to-r from-yellow-50 to-yellow-100":
                          position === 1,
                        "bg-gradient-to-r from-gray-50 to-gray-100":
                          position === 2,
                        "bg-gradient-to-r from-amber-50 to-amber-100":
                          position === 3,
                        "bg-neutral-400/60": position > 3,
                      }
                    )}
                  >
                    {/* Rank Icon */}
                    <div className="flex-shrink-0">{getRankIcon(position)}</div>

                    {/* Avatar */}
                    <Avatar
                      className={cn("size-8 sm:size-12", {
                        "ring-2 ring-yellow-400 ring-offset-1": position === 1,
                        "ring-2 ring-gray-400 ring-offset-1": position === 2,
                        "ring-2 ring-amber-400 ring-offset-1": position === 3,
                      })}
                    >
                      <AvatarImage
                        alt={playerScore.user.name || "Player"}
                        src={playerScore.user.image}
                      />
                      <AvatarFallback className="text-xs font-bold sm:text-sm">
                        {playerScore.user.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Player Info */}
                    <div
                      className={cn("min-w-0 flex-1", {
                        "text-yellow-700": position === 1,
                        "text-gray-700": position === 2,
                        "text-amber-700": position === 3,
                      })}
                    >
                      <p className="truncate text-sm font-bold sm:text-lg">
                        {playerScore.user.name || "Anonymous"}
                      </p>
                      <p
                        className={cn(
                          "text-muted-foreground text-xs sm:text-sm",
                          {
                            "text-yellow-700": position === 1,
                            "text-gray-700": position === 2,
                            "text-amber-700": position === 3,
                          }
                        )}
                      >
                        {playerScore.correctAnswers}/{room.numQuestions} correct
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0">
                      <Badge
                        className={cn(
                          "px-2 py-1 text-sm font-bold sm:px-3 sm:py-2 sm:text-lg",
                          {
                            "bg-yellow-500 text-yellow-50": position === 1,
                            "bg-gray-500 text-gray-50": position === 2,
                            "bg-amber-500 text-amber-50": position === 3,
                            "bg-secondary text-secondary-foreground":
                              position > 3,
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
          </CardContent>
        </Card>

        {/* Questions Breakdown - Simplified */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Target className="text-primary size-6" />
              Questions & Answers
            </CardTitle>
            <CardDescription className="text-base">
              Breakdown of each question and correct answers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <section className="space-y-6 sm:space-y-8">
              {gameResults.questions.map((question, index) => {
                const questionNumber = index + 1

                return (
                  <article key={question._id} className="space-y-4">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                        <Badge
                          className="bg-primary/10 text-primary w-fit px-3 py-2 text-sm font-bold"
                          variant="outline"
                        >
                          Question {questionNumber}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="text-base leading-relaxed font-bold sm:text-lg">
                            {question.question}
                          </h4>
                        </div>
                      </div>

                      {/* Answer Options with Player Avatars */}
                      <section className="space-y-2 sm:space-y-3">
                        {question.answers.map((answer, answerIndex) => {
                          const isCorrect =
                            answerIndex === question.correctAnswerIndex
                          const playersWhoChose =
                            gameResults.playerAnswers.filter(
                              (playerAnswer) =>
                                playerAnswer.questionId === question._id &&
                                playerAnswer.answerIndex === answerIndex
                            )

                          return (
                            <article
                              key={answerIndex}
                              className={cn("rounded-lg p-3 sm:p-4", {
                                "bg-green-100 text-green-800": isCorrect,
                                "bg-red-100 text-red-700": !isCorrect,
                              })}
                            >
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <span className="flex-1 text-sm leading-relaxed font-medium sm:text-base">
                                  {answer}
                                </span>
                                {/* Correct/Incorrect Icon */}
                                <div className="flex-shrink-0">
                                  {isCorrect && (
                                    <CheckCircle className="size-4 text-green-600 sm:size-5" />
                                  )}
                                  {!isCorrect && (
                                    <XCircle className="size-4 text-red-500 sm:size-5" />
                                  )}
                                </div>
                              </div>

                              {/* Player Avatars - Below answer */}
                              {playersWhoChose.length > 0 && (
                                <div className="flex -space-x-2">
                                  {playersWhoChose
                                    .slice(0, 8)
                                    .map((playerAnswer) => (
                                      <Avatar
                                        key={playerAnswer.userId}
                                        className="size-6 border-2 border-white shadow-sm"
                                      >
                                        <AvatarImage
                                          src={playerAnswer.user.image}
                                          alt={
                                            playerAnswer.user.name || "Player"
                                          }
                                        />
                                        <AvatarFallback className="text-xs">
                                          {playerAnswer.user.name
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  {playersWhoChose.length > 8 && (
                                    <div className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm">
                                      +{playersWhoChose.length - 8}
                                    </div>
                                  )}
                                </div>
                              )}
                            </article>
                          )
                        })}
                      </section>
                    </div>

                    {index < gameResults.questions.length - 1 && (
                      <Separator className="my-6 sm:my-8" />
                    )}
                  </article>
                )
              })}
            </section>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}
