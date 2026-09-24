import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Image-background fabric category card (adapted from the provided
 * DestinationCard). Themed gradient overlay + hover parallax zoom, tinted with
 * a warm `themeColor` (HSL "H S% L%"). Title renders serif via the public
 * editorial scope.
 */
export interface FabricCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  href: string;
  /** HSL triple, e.g. "26 32% 19%" */
  themeColor: string;
  className?: string;
}

export function FabricCard({
  imageUrl,
  title,
  subtitle,
  href,
  themeColor,
  className,
}: FabricCardProps) {
  return (
    <div
      style={{ "--theme-color": themeColor } as React.CSSProperties}
      className={cn("group aspect-[3/4] w-full", className)}
    >
      <Link
        href={href}
        aria-label={`Explore ${title}`}
        className="relative block h-full w-full overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out group-hover:-translate-y-1"
        style={{
          boxShadow: `0 16px 40px -20px hsl(var(--theme-color) / 0.6)`,
        }}
      >
        {/* Background image with parallax zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {/* Warm gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, hsl(var(--theme-color) / 0.92), hsl(var(--theme-color) / 0.55) 35%, transparent 68%)`,
          }}
        />
        {/* Content */}
        <div className="relative flex h-full flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>

          <div className="mt-6 flex items-center justify-between rounded-md border border-white/25 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-colors duration-300 group-hover:border-gold/60 group-hover:bg-gold/25">
            <span className="text-xs font-semibold uppercase tracking-widest">
              Explore
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}
