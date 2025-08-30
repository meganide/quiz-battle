export function hasUserJoinedRoom(gamePlayerIds: string[], userId: string) {
  return gamePlayerIds.includes(userId)
}
