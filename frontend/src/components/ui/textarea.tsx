import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-struct border-2 border-md-graphite bg-md-fog px-6 py-4 text-[15px] text-md-ink ring-offset-md-cream placeholder:text-md-slate focus-visible:outline-none focus-visible:border-md-sky-strong focus-visible:bg-md-cloud disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-md",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
