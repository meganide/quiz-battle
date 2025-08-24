import { formatDistanceToNow } from "date-fns"

export function getTimeAgo(timestamp: number): string {
  const distance = formatDistanceToNow(new Date(timestamp), {
    addSuffix: false,
  })
  return `Last seen ${distance} ago`
}
