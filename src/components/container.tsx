import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col p-4">
      <div className={cn("container mx-auto", className)}>{children}</div>
    </div>
  )
}
