"use client"

import React from "react"

import { useQuery } from "convex/react"
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Crown,
  Medal,
  Target,
  Trophy,
  Users,
  XCircle,
} from "lucide-react"

import type { Doc, Id } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Spinner } from "@/components/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

  if (!gameResults) {
    return (
      <section>
        <HeaderTitle href="/quiz-battles" Icon={Trophy} title="Quiz Results" />
        <Container className="flex flex-col items-center gap-4">
          <Spinner size="xl" />
        </Container>
      </section>
    )
  }

  function formatDuration(startTime: number, endTime: number) {
    const duration = Math.floor((endTime - startTime) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }



  function getRankIcon(position: number) {
    switch (position) {
      case 1:
        return <Trophy className="size-6 text-yellow-500" />
      case 2:
        return <Medal className="size-6 text-gray-400" />
      case 3:
        return <Award className="size-6 text-amber-600" />
      default:
        return (
          <div className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-full text-sm font-bold">
            {position}
          </div>
        )
    }
  }


  const gameDuration =
    room.startedAt && room.completedAt
      ? formatDuration(room.startedAt, room.completedAt)
      : "Unknown"

  return (
    <section className="pb-8">
      <HeaderTitle href="/quiz-battles" Icon={Trophy} title="Quiz Results" />

      <Container className="space-y-8">
        {/* Game Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-primary size-5" />
              Game Overview
            </CardTitle>
            <CardDescription>
              Complete game statistics and details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
              <Target className="text-primary size-5" />
              <div>
                <p className="text-muted-foreground text-sm">Topic</p>
                <p className="font-semibold">{room.topics}</p>
              </div>
            </article>

            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">

              <div>
                <p className="text-muted-foreground text-sm">Difficulty</p>
                <p className="font-semibold capitalize">{room.difficulty}</p>
              </div>
            </article>

            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
              <Clock className="text-primary size-5" />
              <div>
                <p className="text-muted-foreground text-sm">
                  Time per Question
                </p>
                <p className="font-semibold">{room.timePerQuestion}s</p>
              </div>
            </article>

            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
              <Calendar className="text-primary size-5" />
              <div>
                <p className="text-muted-foreground text-sm">Total Duration</p>
                <p className="font-semibold">{gameDuration}</p>
              </div>
            </article>

            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
              <Users className="text-primary size-5" />
              <div>
                <p className="text-muted-foreground text-sm">Players</p>
                <p className="font-semibold">
                  {gameResults.playerScores.length}
                </p>
              </div>
            </article>

            <article className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded px-2 py-1 font-mono text-sm">
                  {room.inviteCode}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Room Name</p>
                <p className="font-semibold">{room.name}</p>
              </div>
            </article>
          </CardContent>
        </Card>

        {/* Final Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-yellow-500" />
              Final Leaderboard
            </CardTitle>
            <CardDescription>Final scores and rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <section className="space-y-4">
              {gameResults.playerScores.map((playerScore, index) => {
                const position = index + 1
                return (
                  <article
                    key={playerScore.userId}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                      {
                        "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100":
                          position === 1,
                        "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100":
                          position === 2,
                        "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100":
                          position === 3,
                        "bg-muted/30": position > 3,
                      }
                    )}
                  >
                    {/* Rank */}
                    {getRankIcon(position)}

                    {/* Avatar */}
                    <Avatar
                      className={cn("size-12", {
                        "ring-2 ring-yellow-400 ring-offset-2": position === 1,
                        "ring-2 ring-gray-400 ring-offset-2": position === 2,
                        "ring-2 ring-amber-400 ring-offset-2": position === 3,
                      })}
                    >
                      <AvatarImage
                        alt={playerScore.user.name || "Player"}
                        src={playerScore.user.image}
                      />
                      <AvatarFallback className="text-sm font-bold">
                        {playerScore.user.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Player Info */}
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {playerScore.user.name || "Anonymous"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {playerScore.correctAnswers}/{room.numQuestions} correct
                        answers
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <Badge
                        className={cn("px-4 py-2 text-lg font-bold", {
                          "bg-yellow-500 text-yellow-50": position === 1,
                          "bg-gray-500 text-gray-50": position === 2,
                          "bg-amber-500 text-amber-50": position === 3,
                        })}
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

        {/* Questions Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary size-5" />
              Questions & Answers Breakdown
            </CardTitle>
            <CardDescription>
              Detailed view of each question and player responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <section className="space-y-8">
              {gameResults.questions.map((question, index) => {
                const questionNumber = index + 1

                return (
                  <article key={question._id} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Badge className="text-sm font-bold" variant="outline">
                        Q{questionNumber}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold">
                          {question.question}
                        </h4>

                        {/* Answer Options */}
                        <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
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
                                className={cn(
                                  "rounded-lg border-2 p-3 transition-colors",
                                  {
                                    "bg-green-100 text-green-800": isCorrect,
                                    "bg-red-100 text-red-800": !isCorrect,
                                  }
                                )}
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-medium">{answer}</span>
                                  {isCorrect && (
                                    <CheckCircle className="size-5 text-green-600" />
                                  )}
                                  {!isCorrect && playersWhoChose.length > 0 && (
                                    <XCircle className="size-5 text-red-500" />
                                  )}
                                </div>

                                {playersWhoChose.length > 0 && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                      {playersWhoChose
                                        .slice(0, 10)
                                        .map((playerAnswer) => (
                                          <Avatar
                                            key={playerAnswer.userId}
                                            className="size-6 border-2 border-white"
                                          >
                                            <AvatarImage
                                              src={playerAnswer.user.image}
                                              alt={
                                                playerAnswer.user.name ||
                                                "Player"
                                              }
                                            />
                                            <AvatarFallback className="text-xs">
                                              {playerAnswer.user.name
                                                ?.charAt(0)
                                                .toUpperCase() || "?"}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                      {playersWhoChose.length > 10 && (
                                        <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-xs text-white">
                                          +{playersWhoChose.length - 10}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </article>
                            )
                          })}
                        </section>
                      </div>
                    </div>

                    {index < gameResults.questions.length - 1 && <Separator />}
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
