import { useConvexAuth } from "convex/react"
import { MessagesSquare } from "lucide-react"

import { Logo } from "@/components/logo"
import { SignInDialog } from "@/components/sign-in-dialog"
import { Button } from "@/components/ui/button"

import { NavUser } from "./nav-user"

type AppNavbarProps = {
  setIsChatSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AppNavbar({ setIsChatSidebarOpen }: AppNavbarProps) {
  const { isAuthenticated } = useConvexAuth()

  function toggleChatSidebar() {
    setIsChatSidebarOpen((prev) => !prev)
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-neutral-700 px-4">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <section className="flex items-center gap-4">
          <Logo showTitle />
        </section>
        <section className="flex items-center gap-3">
          {isAuthenticated ? <NavUser /> : <SignInDialog />}
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
