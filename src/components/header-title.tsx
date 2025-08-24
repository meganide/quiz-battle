import type { LucideIcon } from "lucide-react"

type HeaderTitleProps = {
  title: string
  Icon: LucideIcon
}

export function HeaderTitle({ title, Icon }: HeaderTitleProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between gap-2 rounded-sm bg-neutral-500 px-3 py-2">
      <h2>{title}</h2>
      <Icon className="size-8 fill-neutral-300 stroke-neutral-300" />
    </header>
  )
}
