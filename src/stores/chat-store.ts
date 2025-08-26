import { create } from "zustand"

export const DEFAULT_ROOM_ID = "Global" as const

type ChatState = {
  chatRoomIds: string[]
  selectedChatRoomId: string
  setChatRoomId: (chatRoomId: string) => void
  setChatRoomIds: (chatRoomIds: string[]) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  chatRoomIds: [DEFAULT_ROOM_ID],
  selectedChatRoomId: DEFAULT_ROOM_ID,
  setChatRoomId: (chatRoomId: string) =>
    set({ selectedChatRoomId: chatRoomId }),
  setChatRoomIds: (chatRoomIds: string[]) =>
    set({ chatRoomIds: [DEFAULT_ROOM_ID, ...chatRoomIds] }),
  resetChat: () =>
    set({
      selectedChatRoomId: DEFAULT_ROOM_ID,
      chatRoomIds: [DEFAULT_ROOM_ID],
    }),
}))
