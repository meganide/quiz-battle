import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { ChatFooter } from "./chat-footer"
import { ChatHeader } from "./chat-header"

type ChatSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onClose: () => void
}

export function ChatSidebar({ onClose, ...props }: ChatSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" side="right" {...props}>
      <SidebarHeader>
        <ChatHeader onClose={onClose} />
      </SidebarHeader>
      <SidebarContent>Content</SidebarContent>
      <SidebarFooter>
        <ChatFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
