"use client"

import React, { useEffect } from "react"

import { useMutation, useQuery } from "convex/react"

import type { Doc, Id } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { Leaderboard } from "./leaderboard"
import { Timer } from "./timer"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  const [selectedAnswerIndex, setSelectedAnswerIndex] =
    React.useState<number>(-1)

  const gameState = useQuery(api.quiz.queries.getGameState, {
    roomId: room._id,
  })

  const playerScores = useQuery(api.quiz.queries.getPlayerScores, {
    gameStateId: gameState?.gameState._id as Id<"gameStates">,
  })

  const submitAnswerMutation = useMutation(api.quiz.mutations.submitAnswer)

  const currentQuestionNumber = gameState?.currentQuestion.questionIndex
    ? gameState.currentQuestion.questionIndex + 1
    : 1

  function submitAnswer(answerIndex: number) {
    if (!gameState?.gameState._id) {
      return
    }

    setSelectedAnswerIndex(answerIndex)

    void submitAnswerMutation({
      gameStateId: gameState.gameState._id,
      answerIndex,
    })
  }

  useEffect(() => {
    if (selectedAnswerIndex !== -1) {
      setSelectedAnswerIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.gameState.currentQuestionIndex])

  return (
    <Container className="flex h-full min-h-0 flex-col gap-6">
      <header className="flex flex-col gap-4">
        {gameState?.currentQuestion && (
          <p className="text-center text-lg font-semibold">
            Question {currentQuestionNumber} of {room.numQuestions}
          </p>
        )}
        <Timer
          duration={room.timePerQuestion}
          timeStartedAt={gameState?.gameState.questionStartTime ?? Date.now()}
        />
      </header>
      <section className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_325px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-center text-lg leading-normal lg:text-xl">
              {gameState?.currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {gameState?.currentQuestion.answers.map((answer, index) => (
              <Button
                key={answer}
                variant="outline"
                className={cn(
                  "h-full w-full text-base whitespace-pre-line transition-colors hover:bg-neutral-400 lg:py-8 lg:text-lg",
                  {
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
                      selectedAnswerIndex === index ||
                      selectedAnswerIndex === index,
                  }
                )}
                onClick={() => submitAnswer(index)}
              >
                {answer}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Leaderboard
          playerScores={playerScores || []}
          currentQuestionNumber={
            currentQuestionNumber === 0 ? 0 : currentQuestionNumber - 1
          }
        />
      </section>
    </Container>
  )
}
