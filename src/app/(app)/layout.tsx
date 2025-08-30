"use client"

import React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppNavbar } from "./_components/app-navbar"
import { ChatSidebar } from "./_components/chat/chat-sidebar"
import { MobileBottomNavbar } from "./_components/mobile-bottom-navbar"
import { NavSidebar } from "./_components/nav-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = React.useState(false)
  const [isNavSidebarOpen, setIsNavSidebarOpen] = React.useState(false)

  return (
    <section className="flex h-full w-full flex-1 flex-row">
      <SidebarProvider
        className="flex w-full min-w-0 flex-1"
        open={isNavSidebarOpen}
        onOpenChange={setIsNavSidebarOpen}
      >
        <NavSidebar width="w-50" />
        <SidebarInset className="relative flex h-full w-full min-w-0 flex-1">
          <AppNavbar setIsChatSidebarOpen={setIsChatSidebarOpen} />
          <main className="flex-1 overflow-y-auto pb-14 lg:pb-0">
            {children}
          </main>
          <MobileBottomNavbar
            onToggleChatSidebar={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
            onToggleNavSidebar={() => setIsNavSidebarOpen(!isNavSidebarOpen)}
          />
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
