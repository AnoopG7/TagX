import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
