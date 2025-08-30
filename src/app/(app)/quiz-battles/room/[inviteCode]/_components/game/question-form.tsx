"use client"

import { useQuery } from "convex/react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "~/convex/_generated/api"

import { QuestionAnswers } from "./question-answers"

type QuestionFormProps = {
  room: Doc<"rooms">
  gameState: Doc<"gameStates">
}

export function QuestionForm({ gameState, room }: QuestionFormProps) {
  const currentQuestion = useQuery(api.quiz.queries.getCurrentQuestion, {
    gameStateId: gameState._id,
  })

  if (!currentQuestion) return null

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-center text-lg leading-normal lg:text-xl">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      {gameState.phase === "answering" ||
        (gameState.phase === "score" && (
          <CardContent className="flex flex-col gap-2">
            <QuestionAnswers gameState={gameState} room={room} />
          </CardContent>
        ))}
    </Card>
  )
}
