import * as React from "react"
import { cn } from "../../lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "h-6 w-6 shrink-0 cursor-pointer rounded-struct border-2 border-md-graphite bg-md-fog text-md-graphite accent-md-sky-strong focus:ring-0 focus-visible:outline-none focus-visible:border-md-sky-strong disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
