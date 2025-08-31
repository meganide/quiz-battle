"use client"

import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "framer-motion"

import type { Doc } from "~/convex/_generated/dataModel"

import { Container } from "@/components/container"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { api } from "~/convex/_generated/api"

import { Leaderboard } from "./leaderboard"
import { QuestionForm } from "./question-form"
import { Timer } from "./timer"
import { hasUserJoinedRoom } from "../../_utils/game"

type GameLoopProps = {
  room: Doc<"rooms">
  gameState: Doc<"gameStates">
}

export function GameLoop({ room, gameState }: GameLoopProps) {
  const currentQuestion = useQuery(api.quiz.queries.getCurrentQuestion, {
    gameStateId: gameState._id,
  })

  const user = useUser()

  const currentQuestionNumber = currentQuestion?.index
    ? currentQuestion.index + 1
    : 1

  const isSpectating = user?._id
    ? !hasUserJoinedRoom(room.gamePlayerIds, user._id)
    : true

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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

        <AnimatePresence>
          {isSpectating && (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 transform lg:bottom-6"
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div className="text-neutral-050 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm shadow-xl backdrop-blur-sm">
                <motion.div
                  className="bg-destructive size-2 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-xs font-medium lg:text-sm">
                  Spectating Live
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_325px]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <QuestionForm gameState={gameState} room={room} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Leaderboard gameState={gameState} />
          </motion.div>
        </motion.section>
      </Container>
    </motion.div>
  )
}
