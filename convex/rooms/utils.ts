import type { DataModel, Id } from "../_generated/dataModel"
import type { GenericMutationCtx } from "convex/server"

export const generateUniqueInviteCode = async (
  ctx: GenericMutationCtx<DataModel>
): Promise<string> => {
  let inviteCode = generateInviteCode()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while (true) {
    const existingRoom = await ctx.db
      .query("rooms")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
      .first()

    if (!existingRoom) {
      break
    }

    inviteCode = generateInviteCode()
  }

  return inviteCode
}

export const leaveAllActiveRooms = async (
  ctx: GenericMutationCtx<DataModel>,
  userId: Id<"users">
) => {
  const [activeRoomsInLobby, activeRoomsInGame] = await Promise.all([
    ctx.db
      .query("rooms")
      .withIndex("by_status", (q) => q.eq("status", "lobby"))
      .collect(),
    ctx.db
      .query("rooms")
      .withIndex("by_status", (q) => q.eq("status", "ongoing"))
      .collect(),
  ])

  const joinedRoomsInLobby = activeRoomsInLobby.filter((room) =>
    room.onlinePlayerIds.includes(userId)
  )

  const joinedRoomsInGame = activeRoomsInGame.filter((room) =>
    room.onlinePlayerIds.includes(userId)
  )

  await Promise.all([
    ...joinedRoomsInLobby.map(async (room) => {
      const onlinePlayerIds = room.onlinePlayerIds.filter((id) => id !== userId)
      const gamePlayerIds = room.gamePlayerIds.filter((id) => id !== userId)

      if (onlinePlayerIds.length === 0) {
        await ctx.db.delete(room._id)
        return
      }

      if (room.hostId === userId) {
        await ctx.db.patch(room._id, {
          hostId: onlinePlayerIds[0],
          onlinePlayerIds,
          gamePlayerIds,
        })
        return
      }

      await ctx.db.patch(room._id, {
        onlinePlayerIds,
        gamePlayerIds,
      })
    }),
    ...joinedRoomsInGame.map(async (room) => {
      const onlinePlayerIds = room.onlinePlayerIds.filter((id) => id !== userId)

      await ctx.db.patch(room._id, {
        onlinePlayerIds,
      })
    }),
  ])
}

const generateInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
