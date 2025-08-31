"use client"

import { useQuery } from "convex/react"
import { AnimatePresence, motion } from "framer-motion"

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
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-center text-lg leading-normal lg:text-xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentQuestion.question}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentQuestion.question}
              </motion.span>
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <AnimatePresence>
          {(gameState.phase === "answering" || gameState.phase === "score") && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <CardContent className="flex flex-col gap-2">
                <QuestionAnswers gameState={gameState} room={room} />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
