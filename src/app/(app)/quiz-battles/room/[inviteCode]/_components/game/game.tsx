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
  const [selectedAnswerIndex, setSelectedAnswerIndex] = React.useState<
    number | null
  >(null)

  const gameState = useQuery(api.quiz.queries.getGameState, {
    roomId: room._id,
  })

  const playerScores = useQuery(api.quiz.queries.getPlayerScores, {
    gameStateId: gameState?.gameState._id as Id<"gameStates">,
  })

  const submitAnswerMutation = useMutation(api.quiz.mutations.submitAnswer)

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
    if (selectedAnswerIndex) {
      setSelectedAnswerIndex(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.gameState.currentQuestionIndex])

  return (
    <Container className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        {gameState?.currentQuestion && (
          <p className="text-center text-lg font-semibold">
            Question {gameState.currentQuestion.questionIndex + 1} of{" "}
            {room.numQuestions}
          </p>
        )}
        <Timer
          duration={room.timePerQuestion}
          timeStartedAt={gameState?.gameState.questionStartTime ?? Date.now()}
        />
      </header>
      <section className="flex flex-col gap-4 xl:flex-row">
        <Card className="flex-2">
          <CardHeader>
            <CardTitle className="text-center text-xl leading-normal">
              {gameState?.currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {gameState?.currentQuestion.answers.map((answer, index) => (
              <Button
                key={answer}
                disabled={selectedAnswerIndex !== null}
                variant="outline"
                className={cn(
                  "w-full py-8 text-lg transition-colors hover:bg-neutral-400",
                  {
                    "bg-primary text-primary-foreground":
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
        <Leaderboard className="flex-1" playerScores={playerScores || []} />
      </section>
    </Container>
  )
}
