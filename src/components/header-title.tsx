import { type LucideIcon, MoveLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "./ui/button"

type HeaderTitleProps = {
  title: string
  Icon: LucideIcon
  href?: string
}

export function HeaderTitle({ title, Icon, href }: HeaderTitleProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between gap-2 rounded-sm bg-neutral-500 px-3 py-2">
      <div className="flex items-center gap-2">
        {href && (
          <Link href={href}>
            <Button
              className="hover:bg-neutral-400"
              size="icon"
              variant="ghost"
            >
              <MoveLeft className="size-5" />
            </Button>
          </Link>
        )}
        <h2 className="md:text-2xl">{title}</h2>
      </div>
      <Icon className="size-8 fill-neutral-300 stroke-neutral-300" />
    </header>
  )
}
