import { cn } from "#lib/utils";
import type { ReactNode } from "react";

/**
 * Max-width content container.
 * Wraps page content with consistent horizontal padding.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article";
}) {
  return (
    <Tag
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Tag>
  );
}
