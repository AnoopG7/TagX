import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-h2 text-foreground">{title}</h1>
        {description && (
          <p className="text-body-small text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
