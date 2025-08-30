"use client"

import type { GameState } from "~/convex/quiz/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { useSubmitAnswer } from "../../_hooks/use-submit-answer"

type QuestionFormProps = GameState

export function QuestionForm({
  gameState,
  currentQuestion,
}: QuestionFormProps) {
  const { selectedAnswerIndex, submitAnswer } = useSubmitAnswer({ gameState })

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-center text-lg leading-normal lg:text-xl">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {currentQuestion.answers.map((answer, index) => (
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
  )
}
