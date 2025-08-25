import type * as React from "react"

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" side="right" {...props}>
      <SidebarHeader>
        <p>Chat here</p>
      </SidebarHeader>
    </Sidebar>
  )
}
