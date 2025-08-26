import type * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
      xl: "size-10",
      "2xl": "size-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type SpinnerProps = React.ComponentProps<typeof Loader2> &
  VariantProps<typeof spinnerVariants>

export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2 className={cn(spinnerVariants({ size }), className)} {...props} />
  )
}
