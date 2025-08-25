import { MessagesSquare } from "lucide-react"

import { Button } from "@/components/ui/button"

import { NavUser } from "./nav-user"

type AppNavbarProps = {
  setIsChatSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AppNavbar({ setIsChatSidebarOpen }: AppNavbarProps) {
  function toggleChatSidebar() {
    setIsChatSidebarOpen((prev) => !prev)
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-neutral-700 px-4">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <section className="flex items-center gap-4">
          <span className="mr-12">Quiz Battle</span>
        </section>
        <section className="flex items-center gap-3">
          <NavUser />
          <Button
            className="rounded-full bg-neutral-500 hover:bg-neutral-400"
            size="icon"
            variant="ghost"
            onClick={toggleChatSidebar}
          >
            <MessagesSquare />
          </Button>
        </section>
      </nav>
    </div>
  )
}
