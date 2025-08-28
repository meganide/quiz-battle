import { cronJobs } from "convex/server"

import { internal } from "./_generated/api"

const crons = cronJobs()

// Check for expired questions every 5 seconds
crons.interval(
  "check expired questions",
  { seconds: 5 },
  internal.quiz.mutations.checkExpiredQuestions
)

export default crons
