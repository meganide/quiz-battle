import type { QuizDifficulty } from "./types"

export const generateAiQuizPrompt = ({
  numQuestions,
  topics,
  difficulty,
  currentDifficultyInfo,
}: {
  numQuestions: number
  topics: string
  difficulty: QuizDifficulty
  currentDifficultyInfo: DifficultyInfo
}) => `<role>You are an expert quiz creator specializing in educational content. Your task is to generate high-quality, accurate, and engaging multiple-choice questions.</role>
  
  <task>
  Generate exactly ${numQuestions} multiple-choice quiz questions about "${topics}" at ${difficulty} difficulty level.
  </task>
  
  <difficulty_guidelines>
  ${difficulty.toUpperCase()} DIFFICULTY: ${currentDifficultyInfo.description}
  </difficulty_guidelines>
  
  <example>
  Here's an example of a ${difficulty} difficulty question:
  
  Question: "${currentDifficultyInfo.example.question}"
  A) ${currentDifficultyInfo.example.answers[0]}
  B) ${currentDifficultyInfo.example.answers[1]}
  C) ${currentDifficultyInfo.example.answers[2]}
  D) ${currentDifficultyInfo.example.answers[3]}
  Correct Answer: ${String.fromCharCode(65 + currentDifficultyInfo.example.correctAnswerIndex)}
  
  Why this is a good ${difficulty} question: ${currentDifficultyInfo.example.explanation}
  </example>
  
  <requirements>
  CRITICAL REQUIREMENTS:
  1. Generate exactly ${numQuestions} questions - no more, no less
  2. Each question MUST have exactly 4 answer options
  3. Only ONE answer should be correct per question
  4. All questions must be factually accurate and verifiable
  5. Questions must be clearly written and unambiguous
  6. Incorrect answers should be plausible but definitively wrong
  7. Vary the position of correct answers (don't put all correct answers in position A or B)
  8. Ensure questions are appropriate for ${difficulty} difficulty level
  9. Stay strictly within the topics of "${topics}"
  10. Avoid questions with multiple potentially correct interpretations
  11. The language of the questions should be in the same language as the topics
  12. the language of the answers should be in the same language as the topics
  </requirements>
  
  <thinking_process>
  Before generating each question, think through:
  1. What specific aspect of "${topics}" should this question test?
  2. What level of knowledge does this require for ${difficulty} difficulty?
  3. What are 3 plausible but incorrect answers?
  4. Is the correct answer unambiguous and factual?
  5. Does this question add value and not duplicate previous questions?
  </thinking_process>
    
  Generate exactly ${numQuestions} questions now.`

type DifficultyInfo = {
  description: string
  example: {
    question: string
    answers: [string, string, string, string]
    correctAnswerIndex: 0 | 1 | 2 | 3
    explanation: string
  }
}

export const difficultyExamples: Record<QuizDifficulty, DifficultyInfo> = {
  easy: {
    description:
      "Basic knowledge questions that test fundamental concepts and widely known facts.",
    example: {
      question: "What is the capital of France?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswerIndex: 0,
      explanation:
        "Simple factual question with clearly distinguishable answers.",
    },
  },
  medium: {
    description:
      "Questions requiring some analysis or deeper knowledge of the subject matter.",
    example: {
      question:
        "Which programming paradigm emphasizes immutable data and pure functions?",
      answers: [
        "Object-oriented programming",
        "Functional programming",
        "Procedural programming",
        "Assembly programming",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Requires understanding of programming concepts beyond basic definitions.",
    },
  },
  hard: {
    description:
      "Complex questions testing deep understanding, edge cases, or requiring critical thinking.",
    example: {
      question:
        "In quantum computing, what happens when a qubit is measured in a superposition state?",
      answers: [
        "It maintains both states simultaneously",
        "The superposition collapses to a definite state",
        "It becomes entangled with the measurement device",
        "It splits into multiple parallel universes",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Requires deep understanding of quantum mechanics principles and measurement theory.",
    },
  },
}
