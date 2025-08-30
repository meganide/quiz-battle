"use client"

import type { Doc } from "~/convex/_generated/dataModel"
import type { GameState } from "~/convex/quiz/types"

import { Container } from "@/components/container"

import { Leaderboard } from "./leaderboard"
import { QuestionForm } from "./question-form"
import { Timer } from "./timer"

type GameLoopProps = GameState & {
  room: Doc<"rooms">
}

export function GameLoop({ room, gameState, currentQuestion }: GameLoopProps) {
  const currentQuestionNumber = currentQuestion.questionIndex
    ? currentQuestion.questionIndex + 1
    : 1

  const isResultsPhase = gameState.phase === "results"

  return (
    <Container className="flex flex-col gap-6 xl:h-[calc(100svh-96px)]">
      <header className="flex flex-col gap-4">
        <p className="text-center text-lg font-semibold">
          {isResultsPhase
            ? "Results"
            : `Question ${currentQuestionNumber} of ${room.numQuestions}`}
        </p>
        <Timer
          duration={room.timePerQuestion}
          phase={isResultsPhase ? "results" : "question"}
          questionStartTime={gameState.questionStartTime ?? Date.now()}
          resultsStartTime={isResultsPhase ? gameState.updatedAt : undefined}
        />
      </header>
      <section className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_325px]">
        <QuestionForm currentQuestion={currentQuestion} gameState={gameState} />
        <Leaderboard
          currentQuestionId={isResultsPhase ? currentQuestion._id : undefined}
          gameStateId={gameState._id}
          showResults={isResultsPhase}
          currentQuestionNumber={
            currentQuestionNumber === 0 ? 0 : currentQuestionNumber - 1
          }
        />
      </section>
    </Container>
  )
}
