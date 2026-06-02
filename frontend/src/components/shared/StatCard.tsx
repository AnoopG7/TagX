import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "gradient"
  className?: string
}

export function StatCard({ title, value, description, icon, trend, trendValue, variant = "default", className }: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUpIcon : trend === "down" ? TrendingDownIcon : MinusIcon

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        variant === "gradient"
          ? "border-transparent bg-gradient-to-br from-primary/10 via-primary/5 to-background text-foreground"
          : "bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-heading text-2xl font-bold tracking-tight">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {icon && (
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", variant === "gradient" ? "bg-background/50 text-primary" : "bg-primary/10 text-primary")}>
            {icon}
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendIcon className={cn("size-3.5", trend === "up" && "text-green-600", trend === "down" && "text-red-600", trend === "neutral" && "text-muted-foreground")} />
          <span className={cn("text-xs font-medium", trend === "up" && "text-green-600", trend === "down" && "text-red-600", trend === "neutral" && "text-muted-foreground")}>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
