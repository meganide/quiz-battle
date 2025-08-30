export type QuizDifficulty = "easy" | "medium" | "hard"

type QuizQuestion = {
  question: string
  answers: [string, string, string, string]
  correctAnswerIndex: 0 | 1 | 2 | 3
}

export type GeneratedQuiz = QuizQuestion[]
