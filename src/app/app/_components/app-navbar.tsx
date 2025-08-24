import { Swords } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { NavUser } from "./nav-user"

export function AppNavbar() {
  return (
    <nav className="sticky top-0 container mx-auto flex h-16 items-center justify-between gap-4 px-4">
      <section className="flex items-center gap-4">
        <span className="mr-12">Quiz Battle</span>
        <Link href="/app">
          <Button className="text-base" variant="link">
            <Swords className="size-4" /> Battles
          </Button>
        </Link>
      </section>
      <NavUser />
    </nav>
  )
}
