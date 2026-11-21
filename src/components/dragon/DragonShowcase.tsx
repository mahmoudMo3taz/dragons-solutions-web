"use client";

import { useState } from "react";
import { Dragon, type DragonColor, type DragonMode } from "./Dragon";

const colors: { id: DragonColor; swatch: string }[] = [
  { id: "blue", swatch: "#2e7bf0" },
  { id: "red", swatch: "#d7262b" },
  { id: "green", swatch: "#1f9d61" },
  { id: "gold", swatch: "#e3a52a" },
  { id: "purple", swatch: "#7b4fdc" },
];
const modes: DragonMode[] = ["idle", "walk", "fire", "fly"];

type Labels = {
  colors: Record<DragonColor, string>;
  modes: Record<DragonMode, string>;
  colorLabel: string;
  modeLabel: string;
  usage: string;
};

const chip =
  "inline-flex h-9 items-center gap-2 rounded-btn border px-4 text-sm font-semibold transition-colors hover:bg-muted aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background";

export function DragonShowcase({ labels }: { labels: Labels }) {
  const [color, setColor] = useState<DragonColor>("blue");
  const [mode, setMode] = useState<DragonMode>("idle");

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted bg-arcs">
        <Dragon color={color} mode={mode} label={`${labels.colors[color]}, ${labels.modes[mode]}`} />
      </div>

      <div className="grid content-start gap-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold">{labels.colorLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button key={c.id} type="button" className={chip} aria-pressed={color === c.id} onClick={() => setColor(c.id)}>
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.swatch }} />
                {labels.colors[c.id]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">{labels.modeLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button key={m} type="button" className={chip} aria-pressed={mode === m} onClick={() => setMode(m)}>
                {labels.modes[m]}
              </button>
            ))}
          </div>
        </div>
        <pre dir="ltr" className="overflow-x-auto rounded-md bg-[#0b1220] px-4 py-3 font-mono text-[13px] text-[#d6deeb]">
          {`<Dragon color="${color}" mode="${mode}" />`}
        </pre>
        <p className="text-sm text-muted-foreground">{labels.usage}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:col-span-2">
        {colors.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={color === c.id}
            onClick={() => setColor(c.id)}
            className="overflow-hidden rounded-lg border bg-muted pb-3 text-sm font-semibold text-muted-foreground transition-colors aria-pressed:border-foreground aria-pressed:text-foreground"
          >
            <div className="aspect-square">
              <Dragon color={c.id} mode="idle" />
            </div>
            {labels.colors[c.id]}
          </button>
        ))}
      </div>
    </div>
  );
}
