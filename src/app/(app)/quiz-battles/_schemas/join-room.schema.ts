import { z } from "zod"

export const joinRoomSchema = z.object({
  inviteCode: z.string().length(6, "Invite code must be 6 characters"),
})

export type JoinRoom = z.infer<typeof joinRoomSchema>
