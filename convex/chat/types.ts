import type { Doc } from "../_generated/dataModel"

export type ChatMessage = Doc<"chatMessages"> & {
  author: {
    name: string | undefined
    image: string | undefined
  }
  isOwnMessage: boolean
}
