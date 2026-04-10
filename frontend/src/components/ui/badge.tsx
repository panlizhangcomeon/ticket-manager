import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-struct border-2 border-md-graphite px-2 py-0.5 text-eyebrow font-bold uppercase tracking-wider transition-colors focus:outline-none focus-visible:border-md-sky-strong",
        {
          "bg-md-sky text-md-ink": variant === "default",
          "bg-md-fog text-md-ink": variant === "secondary",
          "bg-red-600 text-white": variant === "destructive",
          "bg-md-cloud text-md-ink": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
