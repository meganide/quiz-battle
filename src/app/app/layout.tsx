"use client"

import React from "react"

import { SidebarLeft } from "@/components/sidebars/sidebar-left"
import { SidebarRight } from "@/components/sidebars/sidebar-right"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppNavbar } from "./_components/app-navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = React.useState(false)

  return (
    <section className="flex h-full w-full flex-1 flex-row">
      <SidebarProvider className="flex w-full min-w-0 flex-1">
        <SidebarLeft />
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
        <SidebarRight />
      </SidebarProvider>
    </section>
  )
}
