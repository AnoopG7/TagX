import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function TestimonialCard({
  name,
  role,
  content,
  avatar,
  rating,
}: {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-surface border border-border relative group transition-all duration-200"
      )}
    >
      <span className="absolute top-4 right-6 text-5xl font-display text-border leading-none select-none">
        &ldquo;
      </span>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
        {content}
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      {rating > 0 && (
        <div className="flex items-center gap-0.5 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < rating ? "fill-warning text-warning" : "fill-border text-border"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
