"use client"

import type { Doc } from "~/convex/_generated/dataModel"
import type { GameState } from "~/convex/quiz/types"

import { Container } from "@/components/container"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

import { Leaderboard } from "./leaderboard"
import { QuestionForm } from "./question-form"
import { Timer } from "./timer"
import { hasUserJoinedRoom } from "../../_utils/game"

type GameLoopProps = GameState & {
  room: Doc<"rooms">
}

export function GameLoop({ room, gameState, currentQuestion }: GameLoopProps) {
  const user = useUser()

  const currentQuestionNumber = currentQuestion.questionIndex
    ? currentQuestion.questionIndex + 1
    : 1

  const isResultsPhase = gameState.phase === "results"
  const isSpectating = user?._id
    ? !hasUserJoinedRoom(room.gamePlayerIds, user._id)
    : false

  return (
    <Container
      className={cn(
        "relative flex flex-col gap-6 pb-10 xl:h-[calc(100svh-96px)]",
        {
          "pb-10 xl:pb-0": isSpectating,
        }
      )}
    >
      <header className="flex flex-col gap-4">
        <p className="text-center text-lg font-semibold">
          Question {currentQuestionNumber} of {room.numQuestions}
        </p>
        <Timer duration={room.timePerQuestion} gameState={gameState} />
      </header>

      {isSpectating && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 transform lg:bottom-6">
          <div className="text-neutral-050 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm shadow-xl backdrop-blur-sm">
            <div className="bg-destructive size-2 animate-pulse rounded-full" />
            <span className="text-xs font-medium lg:text-sm">
              Spectating Live
            </span>
          </div>
        </div>
      )}

      <section className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_325px]">
        <QuestionForm
          currentQuestion={currentQuestion}
          gameState={gameState}
          room={room}
        />
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
