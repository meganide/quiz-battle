import type * as React from "react"

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="sticky top-0 hidden h-svh border-l-0 lg:flex"
      collapsible="icon"
      side="right"
      {...props}
    >
      <SidebarHeader>
        <p>Chat here</p>
      </SidebarHeader>
    </Sidebar>
  )
}
