import { cn } from "@/lib/utils";

/**
 * Shared editorial page header: brass eyebrow, serif title, brass divider,
 * optional description. Gives every public page the homepage's cadence.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <header className={cn(centered && "text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 text-4xl font-medium sm:text-5xl">{title}</h1>
      <div className={cn("mt-5 h-px w-14 bg-gold", centered && "mx-auto")} />
      {description && (
        <p
          className={cn(
            "mt-6 max-w-2xl leading-relaxed text-muted-foreground",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
