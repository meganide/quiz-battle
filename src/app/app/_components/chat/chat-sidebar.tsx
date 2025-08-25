"use client"

import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { ChatContent } from "./chat-content"
import { ChatFooter } from "./chat-footer"
import { ChatHeader } from "./chat-header"
import { useSubscribeCurrentRoom } from "../../_hooks/use-subscribe-current-room"

type ChatSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onClose: () => void
}

export function ChatSidebar({ onClose, ...props }: ChatSidebarProps) {
  useSubscribeCurrentRoom()

  return (
    <Sidebar collapsible="offcanvas" side="right" {...props}>
      <SidebarHeader className="flex h-16 items-center justify-center">
        <ChatHeader onClose={onClose} />
      </SidebarHeader>
      <SidebarContent>
        <ChatContent />
      </SidebarContent>
      <SidebarFooter>
        <ChatFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
