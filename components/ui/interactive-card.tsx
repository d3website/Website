"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveCardProps {
  title: string;
  subtitle: string;
  imageUrl: string | null;
  actionText: string;
  actionHref: string;
  /** open the primary action in a new tab (e.g. PDF) */
  actionNewTab?: boolean;
  /** top-right link (collection detail) — hidden when null */
  detailHref?: string | null;
  className?: string;
}

/**
 * 3D-tilt showcase card (adapted from the provided InteractiveTravelCard).
 * Primary action + top-right link are real links; the top-right is hidden when
 * no detailHref is given. White content over a warm image overlay.
 */
export function InteractiveCard({
  title,
  subtitle,
  imageUrl,
  actionText,
  actionHref,
  actionNewTab = false,
  detailHref,
  className,
}: InteractiveCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "relative h-[26rem] w-80 rounded-2xl border border-border/30 bg-muted shadow-2xl",
        className,
      )}
    >
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="absolute inset-4 grid h-[calc(100%-2rem)] w-[calc(100%-2rem)] grid-rows-[1fr_auto] rounded-xl shadow-lg"
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${title}, ${subtitle}`}
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />
        )}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        <div className="relative flex flex-col justify-between rounded-xl p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div style={{ transform: "translateZ(50px)" }}>
              <h3 className="font-serif text-2xl font-medium leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-white/80">
                  {subtitle}
                </p>
              )}
            </div>
            {detailHref && (
              <motion.a
                href={detailHref}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: "2.5deg" }}
                whileTap={{ scale: 0.9 }}
                aria-label={`View ${title}`}
                style={{ transform: "translateZ(60px)" }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <ArrowUpRight className="h-5 w-5 text-white" />
              </motion.a>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ transform: "translateZ(40px)" }}
          >
            <Link
              href={actionHref}
              target={actionNewTab ? "_blank" : undefined}
              rel={actionNewTab ? "noopener noreferrer" : undefined}
              className="block w-full rounded-lg bg-white/10 py-3 text-center text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {actionText}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
