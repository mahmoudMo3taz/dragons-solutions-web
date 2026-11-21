"use client";

import { useEffect, useRef, useState } from "react";
import { Dragon, type DragonMode } from "./Dragon";

/**
 * Big dragon for the home hero. Idles, takes off now and then, and breathes fire
 * when clicked. Colour follows the active design.
 */
export function HeroDragon({ hint }: { hint: string }) {
  const [mode, setMode] = useState<DragonMode>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Every ~12 s, fly for a few seconds
  useEffect(() => {
    const id = setInterval(() => {
      setMode((m) => {
        if (m !== "idle") return m;
        timer.current = setTimeout(() => setMode("idle"), 3500);
        return "fly";
      });
    }, 12000);
    return () => {
      clearInterval(id);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function breathe() {
    if (timer.current) clearTimeout(timer.current);
    setMode("fire");
    timer.current = setTimeout(() => setMode("idle"), 3000);
  }

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <button
        type="button"
        onClick={breathe}
        className="block aspect-[4/3] w-full cursor-pointer rounded-xl focus-visible:outline-2"
        aria-label={hint}
      >
        <Dragon mode={mode} />
      </button>
      <p className="mt-1 text-center text-xs text-hero-foreground/55">{hint}</p>
    </div>
  );
}
