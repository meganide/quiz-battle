"use client"

import { useConvexAuth } from "convex/react"

import { SelectItem } from "@/components/ui/select"

import { OnlineUsers } from "./online-users"

type ChatRoomSelectItemProps = {
  chatRoomId: string
}

export function ChatRoomSelectItem({ chatRoomId }: ChatRoomSelectItemProps) {
  const { isAuthenticated } = useConvexAuth()

  return (
    <SelectItem
      className="flex w-full items-center justify-between"
      value={chatRoomId}
    >
      <span>{chatRoomId}</span>

      {isAuthenticated && <OnlineUsers chatRoomId={chatRoomId} />}
    </SelectItem>
  )
}
