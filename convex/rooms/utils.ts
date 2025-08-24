import type { DataModel, Doc, Id } from "../_generated/dataModel"
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
  const activeRoomsInLobby = await ctx.db
    .query("rooms")
    .withIndex("by_status", (q) => q.eq("status", "lobby"))
    .collect()

  const joinedRoomsInLobby = activeRoomsInLobby.filter((room) =>
    room.gamePlayerIds.includes(userId)
  )

  await Promise.all(
    joinedRoomsInLobby.map(async (room) => {
      const gamePlayerIds = room.gamePlayerIds.filter((id) => id !== userId)

      if (gamePlayerIds.length === 0) {
        await ctx.db.delete(room._id)
        return
      }

      if (room.hostId === userId) {
        await ctx.db.patch(room._id, {
          hostId: gamePlayerIds[0],
          gamePlayerIds,
        })
        return
      }

      await ctx.db.patch(room._id, {
        gamePlayerIds,
      })
    })
  )
}

const generateInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const sortRoomsByCreationDate = (
  rooms: Doc<"rooms">[],
  userId: Id<"users">
) => {
  return [...rooms].sort((a, b) => {
    const aIsCurrentRoom = a.gamePlayerIds.includes(userId)
    const bIsCurrentRoom = b.gamePlayerIds.includes(userId)

    // If one is current room and other is not, current room goes first
    if (aIsCurrentRoom && !bIsCurrentRoom) return -1
    if (!aIsCurrentRoom && bIsCurrentRoom) return 1

    // If both are current room or both are not, sort by creation date (newest first)
    return b._creationTime - a._creationTime
  })
}
