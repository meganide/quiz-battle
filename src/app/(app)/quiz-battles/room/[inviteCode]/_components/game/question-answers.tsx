"use client"

import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "framer-motion"

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
    <motion.div className="flex flex-col gap-2" initial={false}>
      <AnimatePresence mode="wait">
        {questionAnswers.map((answer, index) => {
          const isCorrectAnswer =
            currentQuestionCorrectAnswerIndex !== null &&
            index === currentQuestionCorrectAnswerIndex
          const isSelectedByUser = selectedAnswerIndex === index
          const answerStats = getAnswerStats(index)

          return (
            <motion.div
              key={`${gameState._id}-${index}`}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={
                !isScorePhase && !isSpectating
                  ? {
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }
                  : undefined
              }
              whileTap={
                !isScorePhase && !isSpectating
                  ? {
                      scale: 0.98,
                      transition: { duration: 0.1 },
                    }
                  : undefined
              }
            >
              <Button
                disabled={isScorePhase || isSpectating}
                variant="outline"
                className={cn(
                  "relative flex h-full w-full flex-col items-start gap-0 overflow-hidden border-none text-base whitespace-pre-line transition-all duration-200 disabled:opacity-100 lg:py-5 lg:text-lg",
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
                {/* Selection pulse effect */}
                <AnimatePresence>
                  {isSelectedByUser && !isScorePhase && (
                    <motion.div
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="bg-primary/20 absolute inset-0"
                      exit={{ opacity: 0 }}
                      initial={{ scale: 0, opacity: 0.8 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                <motion.span layout className="flex-1 text-left">
                  {answer}
                </motion.span>

                {/* Player avatars with stagger animation */}
                <AnimatePresence>
                  {isScorePhase && answerStats.players.length > 0 && (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-auto flex items-center -space-x-2"
                      exit={{ opacity: 0, x: 20 }}
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {answerStats.players
                        .slice(0, 10)
                        .map((player, playerIndex) => (
                          <motion.div
                            key={player.userId}
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + playerIndex * 0.05,
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={player.user.image} />
                              <AvatarFallback className="text-xs">
                                {player.user.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                        ))}
                      {answerStats.players.length > 10 && (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-600 text-xs font-medium text-white"
                          initial={{ opacity: 0, scale: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.8,
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          +{answerStats.players.length - 10}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
