import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-struct font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-md ease-in-out focus-visible:outline-none focus-visible:ring-0 focus-visible:border-md-sky-strong disabled:opacity-50 disabled:pointer-events-none disabled:transform-none",
          {
            "border-2 border-md-graphite bg-md-sky text-md-ink uppercase tracking-wide hover:-translate-x-[7px] hover:-translate-y-[7px] hover:shadow-md-lift active:translate-x-0 active:translate-y-0 active:shadow-none":
              variant === "default",
            "border-2 border-md-graphite bg-red-600 text-white hover:bg-red-700 uppercase tracking-wide hover:-translate-x-[7px] hover:-translate-y-[7px] hover:shadow-md-lift active:translate-x-0 active:translate-y-0 active:shadow-none":
              variant === "destructive",
            "border-2 border-md-graphite bg-transparent text-md-ink hover:bg-md-soft-blue":
              variant === "outline",
            "border-2 border-md-graphite bg-md-fog text-md-ink hover:bg-md-cloud":
              variant === "secondary",
            "border-2 border-transparent bg-transparent text-md-ink hover:bg-md-soft-blue":
              variant === "ghost",
            "border-0 bg-transparent p-0 text-md-ink underline-offset-4 hover:underline focus-visible:border-b-2 focus-visible:border-md-sky-strong":
              variant === "link",
            "h-11 px-[22px] py-4 text-sm": size === "default" && variant !== "link",
            "h-9 px-3 text-xs": size === "sm" && variant !== "link",
            "h-12 px-8 text-sm": size === "lg" && variant !== "link",
            "h-10 w-10 shrink-0 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
