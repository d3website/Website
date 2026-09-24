"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InteractiveCard } from "./interactive-card";
import type { ArrivalCard } from "@/lib/data/public";

/**
 * Horizontal carousel of 3D arrival cards. Shows ~3 at a time on desktop and
 * reveals left/right arrows only when the cards overflow (more than fit).
 * Centres the cards when they all fit; scrolls (with snap) when they don't.
 */
export function ArrivalsCarousel({ cards }: { cards: ArrivalCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const over = el.scrollWidth > el.clientWidth + 8;
    setOverflow(over);
    setCanLeft(el.scrollLeft > 8);
    setCanRight(over && el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, cards.length]);

  const scrollByDir = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {overflow && (
        <>
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={!canLeft}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur transition-opacity hover:border-gold/50 disabled:pointer-events-none disabled:opacity-0 md:-left-5"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={!canRight}
            aria-label="Next"
            className="absolute -right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur transition-opacity hover:border-gold/50 disabled:pointer-events-none disabled:opacity-0 md:-right-5"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        style={{ perspective: "1200px" }}
        className={`flex gap-8 overflow-x-auto scroll-smooth px-1 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          overflow ? "snap-x snap-mandatory justify-start" : "justify-center"
        }`}
      >
        {cards.map((a) => (
          <div key={a.id} className="shrink-0 snap-center">
            <InteractiveCard
              title={a.title}
              subtitle={a.subtitle}
              imageUrl={a.imageUrl}
              actionText={a.actionText}
              actionHref={a.actionHref}
              actionNewTab={a.actionNewTab}
              detailHref={a.detailHref}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
