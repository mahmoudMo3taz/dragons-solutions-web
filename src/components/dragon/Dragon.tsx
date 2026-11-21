"use client";

import { useEffect, useRef, useState } from "react";
import type { DragonColor, DragonHandle, DragonMode } from "./engine";
import { dragonColorFor } from "@/lib/themes";

export type { DragonColor, DragonMode };

type Props = {
  /** Leave empty to follow the active site design (night = blue, daylight = red, ember = gold, jade = green) */
  color?: DragonColor;
  mode?: DragonMode;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible description; leave empty when the dragon is decorative */
  label?: string;
};

/**
 * The Dragons Solutions mascot.
 *   <Dragon color="blue" mode="walk" style={{ height: 160 }} />
 * three.js is loaded only when the dragon scrolls into view, and the animation
 * pauses when it is off screen or the tab is hidden. Visitors who prefer reduced
 * motion get a still pose.
 */
/** Dragon colour of the current <html data-theme>, kept in sync when the theme changes */
function useThemeDragonColor(): DragonColor {
  const [c, setC] = useState<DragonColor>("blue");
  useEffect(() => {
    const read = () => setC(dragonColorFor(document.documentElement.dataset.theme));
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return c;
}

export function Dragon({ color: colorProp, mode = "idle", className, style, label }: Props) {
  const themeColor = useThemeDragonColor();
  const color = colorProp ?? themeColor;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<DragonHandle | null>(null);
  const propsRef = useRef({ color, mode });
  propsRef.current = { color, mode };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let visible = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sync = () => handleRef.current?.setRunning(visible && document.visibilityState === "visible");

    const io = new IntersectionObserver(
      async ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !handleRef.current) {
          const { createDragon } = await import("./engine");
          if (disposed) return;
          try {
            handleRef.current = createDragon(canvas, { ...propsRef.current, still });
          } catch {
            wrap.dataset.failed = "true"; // WebGL not available: hide quietly
            return;
          }
        }
        sync();
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => handleRef.current?.resize());
    ro.observe(wrap);
    document.addEventListener("visibilitychange", sync);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => handleRef.current?.setColor(color), [color]);
  useEffect(() => handleRef.current?.setMode(mode), [mode]);

  return (
    <div
      ref={wrapRef}
      className={`dragon${className ? ` ${className}` : ""}`}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
