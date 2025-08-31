"use client"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { useSubmitAnswer } from "../../_hooks/use-submit-answer"
import { hasUserJoinedRoom } from "../../_utils/game"

type QuestionAnswersProps = {
  gameState: Doc<"gameStates">
  room: Doc<"rooms">
}

export function QuestionAnswers({ gameState, room }: QuestionAnswersProps) {
  const user = useUser()

  const { selectedAnswerIndex, submitAnswer } = useSubmitAnswer({ gameState })

  const currentQuestion = useQuery(api.quiz.queries.getCurrentQuestion, {
    gameStateId: gameState._id,
  })

  const questionAnswers = useQuery(
    api.quiz.queries.getQuestionAnswers,
    gameState.phase === "answering" || gameState.phase === "score"
      ? { gameStateId: gameState._id }
      : "skip"
  )

  const currentQuestionCorrectAnswerIndex = useQuery(
    api.quiz.queries.getQuestionCorrectAnswerIndex,
    gameState.phase === "score"
      ? {
          gameStateId: gameState._id,
        }
      : "skip"
  )

  const playerAnswers = useQuery(
    api.quiz.queries.getPlayerAnswersForQuestion,
    gameState.phase === "score" && currentQuestion
      ? { questionId: currentQuestion.id, gameStateId: gameState._id }
      : "skip"
  )

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

  const isScorePhase = gameState.phase === "score"

  const isSpectating = user?._id
    ? !hasUserJoinedRoom(room.gamePlayerIds, user._id)
    : true

  // Don't render anything if we don't have question answers
  if (!questionAnswers) return null

  return (
    <>
      {questionAnswers.map((answer, index) => {
        const isCorrectAnswer =
          currentQuestionCorrectAnswerIndex !== null &&
          index === currentQuestionCorrectAnswerIndex
        const isSelectedByUser = selectedAnswerIndex === index
        const answerStats = getAnswerStats(index)

        return (
          <Button
            key={answer}
            disabled={isScorePhase || isSpectating}
            variant="outline"
            className={cn(
              "flex h-full w-full flex-col items-start gap-0 border-none text-base whitespace-pre-line transition-colors disabled:opacity-100 lg:py-5 lg:text-lg",
              {
                // Question phase styling
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
                  !isScorePhase && isSelectedByUser,
                "hover:bg-neutral-400": !isScorePhase && !isSelectedByUser,

                // Results phase styling
                "bg-green-100 text-green-800 hover:bg-green-100":
                  isScorePhase && isCorrectAnswer,
                "bg-red-100 text-red-800 hover:bg-red-100":
                  isScorePhase && !isCorrectAnswer,
              }
            )}
            onClick={() => !isScorePhase && submitAnswer(index)}
          >
            <span className="flex-1 text-left">{answer}</span>

            {/* Player avatars in document flow */}
            {isScorePhase && answerStats.players.length > 0 && (
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
    </>
  )
}
