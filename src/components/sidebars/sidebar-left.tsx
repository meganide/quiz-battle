/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client"

import type * as React from "react"

import { Menu, PanelLeftClose } from "lucide-react"

import { Sidebar, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// This is sample data.

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Sidebar className="border-r-0" {...props} collapsible="icon">
      <SidebarHeader className="p-0">
        <section
          role="button"
          tabIndex={0}
          className={cn(
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex min-h-16 cursor-pointer items-center gap-2 px-6 font-semibold",
            {
              "justify-center px-0": state === "collapsed",
            }
          )}
          onClick={toggleSidebar}
        >
          {state === "collapsed" ? (
            <Menu className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
          {state === "expanded" && <span>Menu</span>}
        </section>
      </SidebarHeader>
    </Sidebar>
  )
}
