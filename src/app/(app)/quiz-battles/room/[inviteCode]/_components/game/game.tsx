"use client"

import React, { useEffect } from "react"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

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

  function submitAnswer(answerIndex: number) {
    console.log("Submitting answer:", selectedAnswerIndex)
    setSelectedAnswerIndex(answerIndex)
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
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      </section>
    </Container>
  )
}
