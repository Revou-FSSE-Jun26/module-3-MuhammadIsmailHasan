"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useId, useRef } from "react";
import type { ScenePalette, SceneVariant } from "@/lib/site";
import { cn } from "@/lib/format";

/**
 * Layered flat-illustration landscapes (pure SVG, no image files).
 * With `parallax`, each layer moves at a different speed while scrolling.
 * Swap for real photos by replacing <Scene /> with next/image where used.
 */

const PALETTES: Record<ScenePalette, Record<string, string>> = {
  peach: {
    skyTop: "#f4cfa8",
    skyBottom: "#fbe8d3",
    sun: "#fff8ec",
    far: "#b9d3bd",
    mid: "#86b597",
    near: "#4f8a6b",
    tree: "#2e5d48",
    water: "#58a9a3",
    ground: "#e9c8a2",
  },
  sunset: {
    skyTop: "#ef9d73",
    skyBottom: "#f8d3b2",
    sun: "#fff3e2",
    far: "#c78e7d",
    mid: "#8e95a3",
    near: "#2f6b5a",
    tree: "#1f4d40",
    water: "#3d9d9a",
    ground: "#5b3a32",
  },
  mint: {
    skyTop: "#cfe9df",
    skyBottom: "#eef7f2",
    sun: "#ffffff",
    far: "#a6d3c1",
    mid: "#6eb39b",
    near: "#3f8a74",
    tree: "#24584a",
    water: "#5fb5b0",
    ground: "#d9c7a5",
  },
  dusk: {
    skyTop: "#e3b5ad",
    skyBottom: "#f6e1d6",
    sun: "#fff6ee",
    far: "#d8a38c",
    mid: "#b8735f",
    near: "#8a4f45",
    tree: "#5a3535",
    water: "#7393b4",
    ground: "#c98d6f",
  },
};

const BOTTOM = 1100; // layers extend below the viewBox so parallax never shows gaps

function Trees({
  xs,
  base,
  color,
  size = 1,
}: {
  xs: number[];
  base: number;
  color: string;
  size?: number;
}) {
  return (
    <>
      {xs.map((x, i) => {
        const h = (70 + ((i * 37) % 45)) * size;
        const w = h * 0.42;
        return (
          <g key={x} fill={color}>
            <path d={`M${x} ${base - h} L${x + w / 2} ${base} L${x - w / 2} ${base} Z`} />
            <rect x={x - 2.5 * size} y={base - 4} width={5 * size} height={14 * size} />
          </g>
        );
      })}
    </>
  );
}

function useLayer(progress: MotionValue<number>, depth: number, enabled: boolean) {
  return useTransform(progress, [0, 1], enabled ? [-depth, depth] : [0, 0]);
}

export function Scene({
  variant,
  palette = "peach",
  parallax = false,
  className,
}: {
  variant: SceneVariant;
  palette?: ScenePalette;
  parallax?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const c = PALETTES[palette];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const ySun = useLayer(scrollYProgress, 120, parallax);
  const yFar = useLayer(scrollYProgress, 80, parallax);
  const yMid = useLayer(scrollYProgress, 45, parallax);
  const yNear = useLayer(scrollYProgress, 15, parallax);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.skyTop} />
            <stop offset="1" stopColor={c.skyBottom} />
          </linearGradient>
        </defs>
        <rect x="-100" y="-300" width="1800" height="1400" fill={`url(#sky-${uid})`} />

        <motion.g style={{ y: ySun }}>
          <circle
            cx={variant === "lake" ? 1050 : 260}
            cy={variant === "lake" ? 230 : 190}
            r="95"
            fill={c.sun}
          />
        </motion.g>

        {/* drifting clouds */}
        <motion.g
          fill="#ffffff"
          opacity={0.75}
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx="560" cy="150" rx="90" ry="18" />
          <ellipse cx="610" cy="135" rx="50" ry="18" />
          <ellipse cx="1320" cy="110" rx="110" ry="16" />
        </motion.g>

        {variant === "lake" && (
          <motion.g
            stroke="#5a4a48"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            animate={{ x: [0, 40, 0], y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M1180 170 q12 -12 24 0 q12 -12 24 0" />
            <path d="M1250 200 q9 -9 18 0 q9 -9 18 0" />
            <path d="M1130 210 q8 -8 16 0 q8 -8 16 0" />
          </motion.g>
        )}

        {variant === "hills" && (
          <>
            <motion.path
              style={{ y: yFar }}
              fill={c.far}
              d={`M0 470 C 220 380, 420 430, 620 380 S 980 300, 1180 380 S 1480 360, 1600 400 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
            />
            <motion.g style={{ y: yMid }}>
              <path
                fill={c.mid}
                d={`M0 580 C 260 500, 460 540, 720 490 S 1120 470, 1320 530 S 1520 510, 1600 540 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
              />
              <Trees xs={[120, 170, 230, 1380, 1440, 1500]} base={560} color={c.tree} size={0.8} />
            </motion.g>
            <motion.g style={{ y: yNear }}>
              <path
                fill={c.near}
                d={`M0 690 C 300 630, 620 680, 920 640 S 1420 610, 1600 670 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
              />
              <Trees xs={[40, 90, 150, 1460, 1530, 1580]} base={690} color={c.tree} size={1.4} />
            </motion.g>
          </>
        )}

        {variant === "lake" && (
          <>
            <motion.path
              style={{ y: yFar }}
              fill={c.far}
              d={`M0 520 L170 360 L300 450 L470 280 L640 470 L800 390 L980 500 L1150 310 L1320 450 L1460 360 L1600 470 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
            />
            <motion.g style={{ y: yMid }}>
              <path
                fill={c.mid}
                d={`M0 600 L220 450 L380 560 L560 430 L760 600 L1600 600 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
              />
              <Trees
                xs={[30, 80, 130, 180, 230, 1300, 1350, 1400, 1450, 1500, 1550]}
                base={610}
                color={c.tree}
              />
            </motion.g>
            <motion.g style={{ y: yNear }}>
              <rect x="-100" y="605" width="1800" height="600" fill={c.water} />
              <g fill="#ffffff" className="animate-shimmer">
                <rect x="300" y="650" width="160" height="4" rx="2" />
                <rect x="900" y="690" width="220" height="4" rx="2" />
                <rect x="560" y="740" width="120" height="4" rx="2" />
              </g>
              <motion.g
                animate={{ y: [0, -6, 0], rotate: [0, -1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <path fill={c.ground} d="M520 700 L1080 700 L1020 780 L580 780 Z" />
                <rect x="640" y="672" width="120" height="30" rx="6" fill="#a8654a" />
              </motion.g>
            </motion.g>
          </>
        )}

        {variant === "dunes" && (
          <>
            <motion.path
              style={{ y: yFar }}
              fill={c.far}
              d={`M0 500 C 300 400, 600 470, 900 420 S 1400 380, 1600 440 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
            />
            <motion.path
              style={{ y: yMid }}
              fill={c.mid}
              d={`M0 600 C 350 520, 700 600, 1000 540 S 1450 520, 1600 580 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
            />
            <motion.path
              style={{ y: yNear }}
              fill={c.near}
              d={`M0 720 C 400 640, 800 720, 1200 660 S 1500 680, 1600 700 L1600 ${BOTTOM} L0 ${BOTTOM} Z`}
            />
          </>
        )}
      </svg>
    </div>
  );
}
