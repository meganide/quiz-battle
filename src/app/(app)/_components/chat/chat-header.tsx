"use client"

import { PanelRightClose } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useChatStore } from "@/stores/chat-store"

import { ChatRoomSelectItem } from "./chat-room-select-item"

type ChatHeaderProps = {
  onClose: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const { selectedChatRoomId, setChatRoomId, chatRoomIds } = useChatStore()

  return (
    <section className="flex w-full items-center justify-between gap-2">
      <Select value={selectedChatRoomId} onValueChange={setChatRoomId}>
        <SelectTrigger className="w-full [&>span]:w-full">
          <SelectValue placeholder="Chat Room" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {chatRoomIds.map((chatRoomId) => (
            <ChatRoomSelectItem key={chatRoomId} chatRoomId={chatRoomId} />
          ))}
        </SelectContent>
      </Select>
      <Button size="icon" variant="ghost" onClick={onClose}>
        <PanelRightClose className="size-5" />
      </Button>
    </section>
  )
}
