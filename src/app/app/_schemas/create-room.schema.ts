import z from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters"),
  isPrivate: z.boolean(),
  topic: z.string().min(1, "Please enter a topic"),
  numQuestions: z
    .number()
    .min(5, "Minimum 5 questions")
    .max(50, "Maximum 50 questions"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timePerQuestion: z
    .number()
    .min(10, "Minimum 10 seconds")
    .max(60, "Maximum 60 seconds"),
});

export type CreateRoom = z.infer<typeof createRoomSchema>;
