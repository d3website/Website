"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/content";

/**
 * Closing homepage CTA with an animated rotating word (adapted from the
 * provided component). Serif headline, brass rotating word, real phone + contact
 * calls-to-action.
 */
export default function HomepageCta() {
  const [index, setIndex] = useState(0);
  const words = useMemo(
    () => ["space", "room", "home", "style", "moment"],
    [],
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((i) => (i === words.length - 1 ? 0 : i + 1));
    }, 2200);
    return () => clearTimeout(id);
  }, [index, words]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center justify-center gap-8 py-24 text-center lg:py-32">
          <p className="eyebrow">Get in touch</p>

          <h2 className="max-w-3xl text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl">
            <span>Fabrics for every</span>
            <span className="relative flex w-full justify-center overflow-hidden pt-1 md:pb-3">
              &nbsp;
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  className="absolute font-medium text-gold"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    index === i
                      ? { y: 0, opacity: 1 }
                      : { y: index > i ? -150 : 150, opacity: 0 }
                  }
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Committed to unparalleled customer service and impeccable quality —
            and becoming the largest furnishing fabrics company in the world.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              nativeButton={false}
              render={<a href={company.phoneHref} />}
            >
              Call us <PhoneCall className="size-4" />
            </Button>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Get in touch <MoveRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
