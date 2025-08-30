import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="w-full p-4">
      <div className={cn("container mx-auto", className)}>{children}</div>
    </div>
  )
}
