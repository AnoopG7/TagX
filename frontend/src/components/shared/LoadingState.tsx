import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2Icon } from "lucide-react"

interface LoadingStateProps {
  variant?: "spinner" | "skeleton" | "card" | "table"
  text?: string
  className?: string
}

export function LoadingState({ variant = "spinner", text, className }: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <Loader2Icon className="size-8 animate-spin text-primary" />
        {text && <p className="mt-3 text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-3", className)}>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="h-5 flex-1" />)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )
}
