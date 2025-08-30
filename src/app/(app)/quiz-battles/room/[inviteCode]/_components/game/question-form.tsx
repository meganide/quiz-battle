"use client"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"
import type { GameState } from "~/convex/quiz/types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { useSubmitAnswer } from "../../_hooks/use-submit-answer"
import { hasUserJoinedRoom } from "../../_utils/game"

type QuestionFormProps = GameState & {
  room: Doc<"rooms">
}

export function QuestionForm({
  gameState,
  currentQuestion,
  room,
}: QuestionFormProps) {
  const user = useUser()

  const { selectedAnswerIndex, submitAnswer } = useSubmitAnswer({ gameState })

  // Get player answers for results phase
  const playerAnswers = useQuery(
    api.quiz.queries.getPlayerAnswersForQuestion,
    gameState.phase === "results"
      ? { questionId: currentQuestion._id, gameStateId: gameState._id }
      : "skip"
  )

  const isResultsPhase = gameState.phase === "results"

  // Count how many players chose each answer
  const getAnswerStats = (answerIndex: number) => {
    if (!playerAnswers) return { count: 0, players: [] }

    const playersForAnswer = playerAnswers.filter(
      (answer) => answer.answerIndex === answerIndex
    )

    return {
      count: playersForAnswer.length,
      players: playersForAnswer,
    }
  }

  const hasJoinedRoom = user?._id
    ? hasUserJoinedRoom(room.gamePlayerIds, user._id)
    : false

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-center text-lg leading-normal lg:text-xl">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {currentQuestion.answers.map((answer, index) => {
          const isCorrectAnswer = index === currentQuestion.correctAnswerIndex
          const isSelectedByUser = selectedAnswerIndex === index
          const answerStats = getAnswerStats(index)

          return (
            <Button
              key={answer}
              disabled={isResultsPhase || !hasJoinedRoom}
              variant="outline"
              className={cn(
                "flex h-full w-full flex-col items-start gap-0 border-none text-base whitespace-pre-line transition-colors disabled:opacity-100 lg:py-5 lg:text-lg",
                {
                  // Question phase styling
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
                    !isResultsPhase && isSelectedByUser,
                  "hover:bg-neutral-400": !isResultsPhase && !isSelectedByUser,

                  // Results phase styling
                  "bg-green-100 text-green-800":
                    isResultsPhase && isCorrectAnswer,
                  "bg-red-100 text-red-800": isResultsPhase && !isCorrectAnswer,
                }
              )}
              onClick={() => !isResultsPhase && submitAnswer(index)}
            >
              <span className="flex-1 text-left">{answer}</span>

              {/* Player avatars in document flow */}
              {isResultsPhase && answerStats.players.length > 0 && (
                <div className="ml-auto flex items-center -space-x-2">
                  {answerStats.players.slice(0, 10).map((player) => (
                    <Avatar key={player.userId} className="h-5 w-5">
                      <AvatarImage src={player.user.image} />
                      <AvatarFallback className="text-xs">
                        {player.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {answerStats.players.length > 10 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-600 text-xs font-medium text-white">
                      +{answerStats.players.length - 10}
                    </div>
                  )}
                </div>
              )}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
