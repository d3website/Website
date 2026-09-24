"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  images: string[];
  className?: string;
}

const FADE = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
} as const;

/**
 * Centered hero with an animated image marquee scrolling across the bottom
 * (adapted from the provided component). Themed to D3: serif staggered title,
 * brass eyebrow, primary CTA; the demo's red button and bold sans are dropped.
 */
export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  images,
  className,
}: AnimatedMarqueeHeroProps) {
  const loop = [...images, ...images];

  return (
    <section
      className={cn(
        "relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden px-4 text-center",
        className,
      )}
    >
      <div className="z-10 flex flex-col items-center pb-40 md:pb-52">
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE}
          className="eyebrow"
        >
          {tagline}
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-5 max-w-3xl text-4xl font-medium sm:text-5xl md:text-6xl"
        >
          {title.split(" ").map((word, i) => (
            <motion.span key={i} variants={FADE} className="inline-block">
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Button size="lg" nativeButton={false} render={<Link href={ctaHref} />}>
            {ctaText}
          </Button>
        </motion.div>
      </div>

      {/* Animated image marquee */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] md:h-2/5">
        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {loop.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 flex-shrink-0 md:h-64"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full rounded-2xl object-cover shadow-md"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
