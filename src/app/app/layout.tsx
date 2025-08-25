"use client"

import React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppNavbar } from "./_components/app-navbar"
import { ChatSidebar } from "./_components/chat/chat-sidebar"
import { NavSidebar } from "./_components/nav-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = React.useState(false)

  return (
    <section className="flex h-full w-full flex-1 flex-row">
      <SidebarProvider className="flex w-full min-w-0 flex-1">
        <NavSidebar width="w-50" />
        <SidebarInset className="relative flex h-full w-full min-w-0 flex-1">
          <AppNavbar setIsChatSidebarOpen={setIsChatSidebarOpen} />
          <main className="overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <SidebarProvider
        className="flex w-fit min-w-0"
        open={isChatSidebarOpen}
        onOpenChange={setIsChatSidebarOpen}
      >
        <ChatSidebar width="w-80" onClose={() => setIsChatSidebarOpen(false)} />
      </SidebarProvider>
    </section>
  )
}
