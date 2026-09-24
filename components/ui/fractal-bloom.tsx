"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Branch stroke color (any CSS color). Defaults to the brass `--gold`. */
  color?: string;
  /** Solid RGB of the section background, used for the trailing fade. */
  fade?: [number, number, number];
  /** Peak opacity of the trunk (0–1). Branches fade out toward the tips. */
  intensity?: number;
};

/**
 * An animated fractal tree that grows from the bottom-center of its container
 * and gently bends toward the pointer. Re-themed from the "Fractal Bloom"
 * concept to D3's warm palette. Sizes itself to its parent (not the viewport),
 * is DPR-crisp, and renders a static tree when the user prefers reduced motion.
 */
export function FractalBloomCanvas({
  className,
  color = "rgb(183, 145, 98)",
  fade = [28, 25, 23],
  intensity = 0.55,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const maxDepth = 9;
    let width = 0;
    let height = 0;
    let currentDepth = reduced ? maxDepth : 0;
    let raf = 0;

    // Mouse starts at the base so the tree is symmetric until the user moves.
    const mouse = { x: 0, y: 0 };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
    ) => {
      if (depth > currentDepth) return;

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      ctx.globalAlpha = (1 - depth / maxDepth) * intensity;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(0.4, 1.4 - (depth / maxDepth) * 1);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Pointer nudges the branching angle for nearby limbs.
      const distToMouse = Math.hypot(endX - mouse.x, endY - mouse.y);
      const mouseEffect = Math.max(0, 1 - distToMouse / (height / 2));
      const angleOffset = (Math.PI / 8) * mouseEffect;

      drawBranch(endX, endY, angle - Math.PI / 10 - angleOffset, length * 0.8, depth + 1);
      drawBranch(endX, endY, angle + Math.PI / 10 + angleOffset, length * 0.8, depth + 1);
    };

    const paint = () => {
      const startX = width / 2;
      const startY = height;
      const startLength = height / 4.5;
      drawBranch(startX, startY, -Math.PI / 2, startLength, 0);
    };

    const animate = () => {
      // Semi-transparent wash creates soft, glowing trails as it grows.
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${fade[0]}, ${fade[1]}, ${fade[2]}, 0.16)`;
      ctx.fillRect(0, 0, width, height);
      paint();
      if (currentDepth < maxDepth) currentDepth += 0.03;
      raf = requestAnimationFrame(animate);
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mouse.x === 0 && mouse.y === 0) {
        mouse.x = width / 2;
        mouse.y = height;
      }
      // Repaint immediately so a resize never leaves a blank frame.
      ctx.fillStyle = `rgb(${fade[0]}, ${fade[1]}, ${fade[2]})`;
      ctx.fillRect(0, 0, width, height);
      if (reduced) paint();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    if (!reduced) {
      window.addEventListener("pointermove", onMove);
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [color, fade, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
    />
  );
}

export default FractalBloomCanvas;
