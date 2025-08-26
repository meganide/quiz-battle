import type * as React from "react"

import { Home, Menu, MessagesSquare, Swords } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MobileBottomNavbarProps = React.HTMLAttributes<HTMLElement> & {
  onToggleNavSidebar?: () => void
  onToggleChatSidebar?: () => void
}

export function MobileBottomNavbar({
  onToggleNavSidebar,
  onToggleChatSidebar,
  ...props
}: MobileBottomNavbarProps) {
  return (
    <nav
      className={cn(
        "bg-sidebar fixed right-0 bottom-0 left-0 z-50 border-t lg:hidden",
        props.className
      )}
      {...props}
    >
      <section className="flex h-14 items-center justify-evenly">
        <Button
          className="hover:text-accent-foreground flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-neutral-100 transition-colors"
          size="icon"
          variant="ghost"
          onClick={onToggleNavSidebar}
        >
          <Menu className="size-5" />
          <span>Menu</span>
        </Button>

        <Link href="/">
          <Button
            className="hover:text-accent-foreground flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-neutral-100"
            variant="ghost"
          >
            <Home className="size-5" />
            <span>Home</span>
          </Button>
        </Link>
        <Button
          className="hover:text-accent-foreground flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-neutral-100 transition-colors"
          size="icon"
          variant="ghost"
          onClick={onToggleChatSidebar}
        >
          <MessagesSquare className="size-5" />
          <span>Chat</span>
        </Button>

        <Link href="/quiz-battles">
          <Button
            className="hover:text-accent-foreground flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-neutral-100"
            variant="ghost"
          >
            <Swords className="size-5" />
            <span>Quiz Battles</span>
          </Button>
        </Link>
      </section>
    </nav>
  )
}
