"use client"

import React from "react"

import { Brain, CheckCircle, Crown, Timer, Trophy, XCircle } from "lucide-react"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { HeaderTitle } from "@/components/header-title"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

import { useGameLoop } from "../_hooks/use-game-loop"
import { useGameState } from "../_hooks/use-game-state"
import { useTimer } from "../_hooks/use-timer"

type GameProps = {
  room: Doc<"rooms">
}

export function Game({ room }: GameProps) {
  const user = useUser()
  const {
    gameState,
    gameProgress,
    currentQuestion,
    playerScores,
    submitAnswer,
  } = useGameState(room._id)
  const { userAnswer, questionResults, hasAnswered, setHasAnswered } =
    useGameLoop(room._id)

  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset selectedAnswer when question changes
  React.useEffect(() => {
    setSelectedAnswer(null)
  }, [currentQuestion?._id])

  const { timeLeft, percentage } = useTimer({
    duration: room.timePerQuestion,
    onTimeUp: () => {
      // Timer is just for display - backend handles progression
    },
    isActive: gameState?.phase === "question" && !hasAnswered,
    startTime: gameState?.questionStartTime,
  })

  const handleAnswerSelect = async (answerIndex: number) => {
    if (hasAnswered || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    setIsSubmitting(true)

    try {
      await submitAnswer({
        questionId: currentQuestion._id,
        answerIndex,
      })
      setHasAnswered(true)
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!gameState || !gameProgress) {
    return (
      <section>
        <HeaderTitle
          href="/quiz-battles"
          Icon={Brain}
          title="Loading Game..."
        />
        <Container className="flex justify-center py-8">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
        </Container>
      </section>
    )
  }

  if (gameState.phase === "finished") {
    return (
      <section>
        <HeaderTitle
          href="/quiz-battles"
          Icon={Trophy}
          title="Game Finished!"
        />
        <Container className="space-y-6">
          <article className="py-8 text-center">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h2 className="mb-2 text-2xl font-bold">Game Complete!</h2>
            <p className="text-muted-foreground">
              Check out the final leaderboard below
            </p>
          </article>
          <FinalLeaderboard playerScores={playerScores || []} />
        </Container>
      </section>
    )
  }

  return (
    <section>
      <HeaderTitle href="/quiz-battles" Icon={Brain} title={room.name} />
      <Container className="space-y-6">
        <GameProgressCard gameProgress={gameProgress} />

        <article className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            {gameState.phase === "question" && currentQuestion && (
              <QuestionCard
                hasAnswered={hasAnswered}
                isSubmitting={isSubmitting}
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                timeLeft={timeLeft}
                timePercentage={percentage}
                userAnswer={userAnswer}
                onAnswerSelect={handleAnswerSelect}
              />
            )}

            {gameState.phase === "results" && questionResults && (
              <ResultsCard
                questionResults={questionResults}
                userAnswer={userAnswer}
              />
            )}
          </section>

          <aside className="lg:col-span-1">
            <LiveLeaderboard
              currentUserId={user?._id}
              playerScores={playerScores || []}
            />
          </aside>
        </article>
      </Container>
    </section>
  )
}

function GameProgressCard({ gameProgress }: { gameProgress: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {gameProgress.currentQuestionIndex + 1} of{" "}
            {gameProgress.totalQuestions}
          </span>
          <Badge className="capitalize" variant="outline">
            {gameProgress.phase}
          </Badge>
        </div>
        <Progress
          className="h-2"
          value={
            ((gameProgress.currentQuestionIndex + 1) /
              gameProgress.totalQuestions) *
            100
          }
        />
      </CardContent>
    </Card>
  )
}

function QuestionCard({
  question,
  timeLeft,
  timePercentage,
  selectedAnswer,
  userAnswer,
  hasAnswered,
  isSubmitting,
  onAnswerSelect,
}: {
  question: any
  timeLeft: number
  timePercentage: number
  selectedAnswer: number | null
  userAnswer: any
  hasAnswered: boolean
  isSubmitting: boolean
  onAnswerSelect: (index: number) => void
}) {
  const getTimerColor = () => {
    if (timeLeft > 20) return "bg-green-500"
    if (timeLeft > 10) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Question {question.questionIndex + 1}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-lg font-bold">
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <Progress
          className={cn("h-3", getTimerColor())}
          value={timePercentage}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg leading-relaxed font-semibold md:text-xl">
          {question.question}
        </h3>

        <div className="grid gap-3">
          {question.answers.map((answer: string, index: number) => {
            const isSelected = selectedAnswer === index
            const isUserAnswer = userAnswer?.answerIndex === index
            const isDisabled = hasAnswered || isSubmitting

            return (
              <Button
                key={index}
                disabled={isDisabled}
                variant={isSelected || isUserAnswer ? "default" : "outline"}
                className={cn(
                  "h-auto justify-start p-3 text-left text-sm md:p-4 md:text-base",
                  isDisabled && "cursor-not-allowed opacity-60",
                  isUserAnswer && "ring-primary ring-2"
                )}
                onClick={() => onAnswerSelect(index)}
              >
                <span className="bg-muted mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-left">{answer}</span>
              </Button>
            )
          })}
        </div>

        {hasAnswered && (
          <article className="py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Answer submitted!</span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Waiting for other players...
            </p>
          </article>
        )}
      </CardContent>
    </Card>
  )
}

function ResultsCard({
  questionResults,
  userAnswer,
}: {
  questionResults: any
  userAnswer: any
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Question Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold md:text-xl">
          {questionResults.question.question}
        </h3>

        <div className="grid gap-3">
          {questionResults.question.answers.map(
            (answer: string, index: number) => {
              const isCorrect =
                index === questionResults.question.correctAnswerIndex
              const isUserAnswer = userAnswer?.answerIndex === index
              const answerCount = questionResults.answerDistribution[index]
              const percentage =
                questionResults.totalAnswers > 0
                  ? Math.round(
                      (answerCount / questionResults.totalAnswers) * 100
                    )
                  : 0

              return (
                <article
                  key={index}
                  className={cn(
                    "rounded-lg border p-3 md:p-4",
                    isCorrect &&
                      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
                    isUserAnswer &&
                      !isCorrect &&
                      "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
                    !isCorrect && !isUserAnswer && "bg-muted/50"
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="bg-background flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="truncate text-sm font-medium md:text-base">
                        {answer}
                      </span>
                      {isCorrect && (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                      )}
                      {isUserAnswer && !isCorrect && (
                        <XCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                      )}
                    </div>
                    <span className="flex-shrink-0 text-sm font-medium">
                      {percentage}%
                    </span>
                  </div>
                  <Progress className="h-2" value={percentage} />
                </article>
              )
            }
          )}

          {/* Show "No Answer" statistics if any players didn't answer */}
          {questionResults.answerDistribution[4] > 0 && (
            <article className="bg-muted/50 rounded-lg border p-3 md:p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="bg-background flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    -
                  </span>
                  <span className="truncate text-sm font-medium md:text-base">
                    No Answer
                  </span>
                  <XCircle className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                </div>
                <span className="flex-shrink-0 text-sm font-medium">
                  {questionResults.totalAnswers > 0
                    ? Math.round(
                        (questionResults.answerDistribution[4] /
                          questionResults.totalAnswers) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                className="h-2"
                value={
                  questionResults.totalAnswers > 0
                    ? (questionResults.answerDistribution[4] /
                        questionResults.totalAnswers) *
                      100
                    : 0
                }
              />
            </article>
          )}
        </div>

        {userAnswer?.answerIndex === null ? (
          <article className="text-muted-foreground py-4 text-center">
            <XCircle className="mx-auto mb-2 h-8 w-8" />
            <p className="font-medium">You didn't answer in time!</p>
          </article>
        ) : userAnswer?.isCorrect ? (
          <article className="py-4 text-center text-green-600">
            <CheckCircle className="mx-auto mb-2 h-8 w-8" />
            <p className="font-medium">Correct! Well done!</p>
          </article>
        ) : (
          <article className="py-4 text-center text-red-600">
            <XCircle className="mx-auto mb-2 h-8 w-8" />
            <p className="font-medium">
              Not quite right, better luck next time!
            </p>
          </article>
        )}
      </CardContent>
    </Card>
  )
}

function LiveLeaderboard({
  playerScores,
  currentUserId,
}: {
  playerScores: any[]
  currentUserId: string | undefined
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Live Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {playerScores.map((player, index) => {
            const isCurrentUser = player.userId === currentUserId
            const isLeader = index === 0

            return (
              <article
                key={player.userId}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3",
                  isCurrentUser && "bg-primary/10 ring-primary/20 ring-1",
                  !isCurrentUser && "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                      isLeader
                        ? "bg-yellow-500 text-yellow-950"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  {isLeader && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.image} />
                  <AvatarFallback>
                    {player.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {player.name}
                    {isCurrentUser && " (You)"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {player.correctAnswers}/{player.totalAnswered} correct
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">
                    {player.score.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs">pts</p>
                </div>
              </article>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function FinalLeaderboard({ playerScores }: { playerScores: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Final Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playerScores.map((player, index) => {
            const isWinner = index === 0
            let medal = null
            if (index === 0) medal = "🥇"
            else if (index === 1) medal = "🥈"
            else if (index === 2) medal = "🥉"

            return (
              <article
                key={player.userId}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-4",
                  isWinner
                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                    : "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{medal || `#${index + 1}`}</span>
                  {isWinner && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={player.image} />
                  <AvatarFallback className="text-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {player.correctAnswers}/{player.totalAnswered} correct
                    answers
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">
                    {player.score.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-sm">points</p>
                </div>
              </article>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
