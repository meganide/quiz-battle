/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client"

import type * as React from "react"

import { Menu, PanelLeftClose, Swords } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state } = useSidebar()

  const path = usePathname()
  const isQuizBattles = path === "/app"

  return (
    <Sidebar className="border-r-0" {...props} collapsible="icon">
      <SidebarHeader className="p-0 shadow-[0_3px_6px_rgba(0,0,0,0.1)]">
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
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/app">
              <SidebarMenuButton isActive={isQuizBattles}>
                <Swords />
                {state === "expanded" && <span>Quiz Battles</span>}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
