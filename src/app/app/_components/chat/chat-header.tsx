"use client"

import { useState } from "react"

import { PanelRightClose } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import { api } from "~/convex/_generated/api"

import { usePresence } from "../../room/[inviteCode]/_hooks/use-presence"

type ChatHeaderProps = {
  onClose: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const [chatRoom, setChatRoom] = useState("global")
  const user = useUser()
  const presenceState = usePresence(api.presence, "global_chat", user?._id)

  const onlineUsers =
    presenceState?.filter(
      (presence) => presence.online && presence.userId !== user?._id
    ).length ?? 0

  return (
    <section className="flex w-full items-center justify-between gap-2">
      <Select value={chatRoom} onValueChange={setChatRoom}>
        <SelectTrigger className="w-full [&>span]:w-full">
          <SelectValue placeholder="Chat Room" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem
            className="flex w-full items-center justify-between"
            value="global"
          >
            <span>Global</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground text-xs">
                {onlineUsers} online
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button size="icon" variant="ghost" onClick={onClose}>
        <PanelRightClose className="size-5" />
      </Button>
    </section>
  )
}
