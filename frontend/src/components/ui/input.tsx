import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-struct border-2 border-md-graphite bg-md-fog px-6 py-4 text-[15px] text-md-ink ring-offset-md-cream file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-md-slate focus-visible:outline-none focus-visible:border-md-sky-strong focus-visible:bg-md-cloud disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-md",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
