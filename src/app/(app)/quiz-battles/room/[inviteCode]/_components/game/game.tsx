"use client"

import React from "react"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { Timer } from "./timer"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = React.useState<
    string | null
  >(null)

  const gameState = useQuery(api.quiz.queries.getGameState, {
    roomId: room._id,
  })

  function handleSubmitAnswer() {
    console.log("Submitting answer:", selectedAnswerIndex)
  }

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
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedAnswerIndex}
              onValueChange={setSelectedAnswerIndex}
            >
              {gameState?.currentQuestion.answers.map((answer, index) => (
                <article key={answer} className="flex items-center space-x-2">
                  <RadioGroupItem
                    circleClassName="size-3"
                    className="border-secondary size-5"
                    id={`answer-${index}`}
                    value={index.toString()}
                  />
                  <Label
                    className="flex-1 cursor-pointer text-lg"
                    htmlFor={`answer-${index}`}
                  >
                    {answer}
                  </Label>
                </article>
              ))}
            </RadioGroup>

            <Button
              className="w-full"
              disabled={!selectedAnswerIndex}
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </Button>
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
