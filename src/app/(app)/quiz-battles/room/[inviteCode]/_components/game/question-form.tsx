"use client"

import { useQuery } from "convex/react"
import { CheckCircle, User } from "lucide-react"

import type { GameState } from "~/convex/quiz/types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { useSubmitAnswer } from "../../_hooks/use-submit-answer"

type QuestionFormProps = GameState

export function QuestionForm({
  gameState,
  currentQuestion,
}: QuestionFormProps) {
  const { selectedAnswerIndex, submitAnswer } = useSubmitAnswer({ gameState })

  // Get player answers for results phase
  const playerAnswers = useQuery(
    api.quiz.queries.getPlayerAnswersForQuestion,
    gameState.phase === "results" ? { questionId: currentQuestion._id } : "skip"
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
            <div key={answer} className="relative">
              <Button
                disabled={isResultsPhase}
                variant="outline"
                className={cn(
                  "h-full w-full text-base whitespace-pre-line transition-colors lg:py-8 lg:text-lg",
                  {
                    // Question phase styling
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
                      !isResultsPhase && isSelectedByUser,
                    "hover:bg-neutral-400":
                      !isResultsPhase && !isSelectedByUser,

                    // Results phase styling
                    "border-green-500 bg-green-100 text-green-800 hover:bg-green-100":
                      isResultsPhase && isCorrectAnswer,
                    "border-red-200 bg-red-100 text-red-800 hover:bg-red-100":
                      isResultsPhase &&
                      !isCorrectAnswer &&
                      answerStats.count > 0,
                    "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-50":
                      isResultsPhase &&
                      !isCorrectAnswer &&
                      answerStats.count === 0,
                  }
                )}
                onClick={() => !isResultsPhase && submitAnswer(index)}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex-1 text-left">{answer}</span>

                  {isResultsPhase && (
                    <div className="ml-4 flex items-center gap-2">
                      {isCorrectAnswer && (
                        <Badge
                          className="bg-green-500 text-white"
                          variant="secondary"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Correct
                        </Badge>
                      )}
                      {answerStats.count > 0 && (
                        <Badge
                          className="flex items-center gap-1"
                          variant="outline"
                        >
                          <User className="h-3 w-3" />
                          {answerStats.count}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Button>

              {/* Show player avatars who chose this answer */}
              {isResultsPhase && answerStats.players.length > 0 && (
                <div className="mt-2 flex justify-center -space-x-2">
                  {answerStats.players.slice(0, 5).map((player) => (
                    <Avatar
                      key={player.userId}
                      className="h-6 w-6 border-2 border-white"
                    >
                      <AvatarImage src={player.user.image} />
                      <AvatarFallback className="text-xs">
                        {player.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {answerStats.players.length > 5 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium">
                      +{answerStats.players.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
