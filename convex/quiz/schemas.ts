import { z } from "zod"

const QuizQuestionSchema = z.object({
  question: z.string().describe("The quiz question"),
  answers: z
    .array(z.string().describe("Answer option"))
    .length(4)
    .describe("Exactly 4 answer options"),
  correctAnswerIndex: z
    .number()
    .min(0)
    .max(3)
    .describe("Index of the correct answer (0-3)"),
})

export const GeneratedQuizSchema = z
  .array(QuizQuestionSchema)
  .describe("Array of quiz questions")
