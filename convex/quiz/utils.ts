import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { z } from "zod"

import type { GeneratedQuiz, QuizDifficulty } from "./types"

import { difficultyExamples, generateAiQuizPrompt } from "./prompts"
import { GeneratedQuizSchema } from "./schemas"

export async function generateQuizQuestions(
  topics: string,
  numQuestions: number,
  difficulty: QuizDifficulty
): Promise<GeneratedQuiz> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY environment variable is not set")
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
    apiKey: apiKey,
  })

  const structuredLlm = model.withStructuredOutput(GeneratedQuizSchema, {
    name: "quiz_generation",
  })

  const currentDifficultyInfo = difficultyExamples[difficulty]

  try {
    const promptText = generateAiQuizPrompt({
      numQuestions,
      topics,
      difficulty,
      currentDifficultyInfo,
    })
    const questions = await structuredLlm.invoke(promptText)

    return questions as GeneratedQuiz
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid response structure: ${error.issues
          .map((e) => `${String(e.path.join(".") || "unknown")}: ${e.message}`)
          .join(", ")}`
      )
    }

    throw new Error(
      `Failed to generate quiz questions: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}
