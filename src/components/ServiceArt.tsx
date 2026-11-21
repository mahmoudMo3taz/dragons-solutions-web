import type { ServiceIcon } from "@/content/services";

// Hand-built illustrations, one per service. Each shows the real thing the
// service delivers. Colours come from the --art-* variables of the active theme.
// To use a photo instead, set `photo` on the service in src/content/services.ts.

const C = {
  panel: "var(--art-panel)",
  panel2: "var(--art-panel2)",
  panel3: "var(--art-panel3)",
  line: "var(--art-line)",
  soft: "var(--art-soft)",
  text: "var(--art-text)",
  dim: "var(--art-dim)",
  faint: "var(--art-faint)",
  blue: "var(--art-blue)",
  blueSoft: "var(--art-blue-soft)",
  red: "var(--art-red)",
  redInk: "var(--art-red-ink)",
  ok: "var(--art-ok)",
};

const mono = { fontFamily: "IBM Plex Mono, monospace" } as const;
const sans = { fontFamily: "IBM Plex Sans, sans-serif" } as const;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 480 320" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet" style={{ direction: "ltr" }}>
      <rect width="480" height="320" fill="var(--art-bg)" />
      <g stroke={C.soft} strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="320" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="480" y2={i * 60} />
        ))}
      </g>
      {children}
    </svg>
  );
}

function ManagedIT() {
  return (
    <Frame label="Server rack with a resolved support ticket">
      <rect x="52" y="36" width="176" height="252" rx="12" fill={C.panel} stroke={C.line} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 56 + i * 44;
        const alert = i === 2;
        return (
          <g key={i}>
            <rect x="68" y={y} width="144" height="32" rx="6" fill={C.panel2} stroke={C.soft} />
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <line key={v} x1={80 + v * 8} y1={y + 10} x2={80 + v * 8} y2={y + 22} stroke={C.faint} strokeWidth="2" strokeLinecap="round" />
            ))}
            <circle cx="172" cy={y + 16} r="3.5" fill={C.ok} />
            <circle cx="184" cy={y + 16} r="3.5" fill={alert ? C.red : C.ok} />
            <circle cx="196" cy={y + 16} r="3.5" fill={C.faint} />
          </g>
        );
      })}
      <path d="M188 144 C 220 144, 228 132, 252 132" fill="none" stroke={C.red} strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="252" y="84" width="192" height="132" rx="12" fill={C.panel} stroke={C.line} />
      <text x="272" y="112" fontSize="13" fill={C.dim} style={mono}>Ticket #2041</text>
      <text x="272" y="140" fontSize="16" fill={C.text} style={sans}>Outlook not syncing</text>
      <text x="272" y="162" fontSize="13" fill={C.dim} style={sans}>Finance · 3 users</text>
      <line x1="272" y1="178" x2="424" y2="178" stroke={C.soft} />
      <circle cx="277" cy="197" r="3.5" fill={C.ok} />
      <text x="288" y="201" fontSize="13" fill={C.text} style={mono}>Resolved in 14 min</text>
      <rect x="252" y="232" width="192" height="52" rx="12" fill={C.panel} stroke={C.line} />
      <text x="272" y="263" fontSize="13" fill={C.dim} style={mono}>Backup 02:00</text>
      <circle cx="404" cy="259" r="3.5" fill={C.ok} />
      <text x="412" y="263" fontSize="13" fill={C.text} style={mono}>OK</text>
    </Frame>
  );
}

function Apps() {
  return (
    <Frame label="Windows automation flow and a mobile field app">
      <rect x="36" y="44" width="300" height="208" rx="12" fill={C.panel} stroke={C.line} />
      <rect x="36" y="44" width="300" height="32" rx="12" fill={C.panel2} />
      <rect x="36" y="64" width="300" height="12" fill={C.panel2} />
      <text x="52" y="65" fontSize="13" fill={C.dim} style={mono}>Approvals.exe</text>
      {[
        { x: 56, label: "Form" },
        { x: 140, label: "Approve" },
        { x: 224, label: "ERP" },
      ].map((n, i) => (
        <g key={n.label}>
          <rect x={n.x} y="132" width="68" height="40" rx="8" fill={i === 2 ? C.blueSoft : C.panel2} stroke={i === 2 ? C.blue : C.line} />
          <text x={n.x + 34} y="157" fontSize="13" fill={C.text} textAnchor="middle" style={sans}>{n.label}</text>
          {i < 2 && <path d={`M${n.x + 68} 152 H${n.x + 84}`} stroke={C.dim} strokeWidth="1.5" />}
        </g>
      ))}
      <text x="56" y="214" fontSize="13" fill={C.dim} style={mono}>Runs today 148 · errors 0</text>
      <rect x="300" y="64" width="140" height="240" rx="24" fill={C.panel} stroke={C.line} />
      <rect x="310" y="76" width="120" height="216" rx="16" fill={C.panel2} />
      <rect x="350" y="84" width="40" height="5" rx="2.5" fill={C.faint} />
      <text x="322" y="114" fontSize="14" fill={C.text} style={sans}>Site report</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="322" y={128 + i * 32} width="96" height="24" rx="6" fill={C.panel3} />
          <circle cx="334" cy={140 + i * 32} r="5" fill={i < 3 ? C.ok : "none"} stroke={i < 3 ? "none" : C.dim} />
          <rect x="346" y={137 + i * 32} width={i % 2 ? 40 : 56} height="6" rx="3" fill={C.faint} />
        </g>
      ))}
      <rect x="322" y="260" width="96" height="24" rx="8" fill={C.red} />
      <text x="370" y="276" fontSize="12" fill="var(--art-label)" textAnchor="middle" style={sans}>Submit</text>
    </Frame>
  );
}

function Web() {
  return (
    <Frame label="Website in a browser, hosted in the cloud or on your own server">
      <rect x="32" y="40" width="296" height="232" rx="12" fill={C.panel} stroke={C.line} />
      <circle cx="50" cy="58" r="4" fill={C.faint} />
      <circle cx="64" cy="58" r="4" fill={C.faint} />
      <circle cx="78" cy="58" r="4" fill={C.faint} />
      <rect x="100" y="49" width="160" height="18" rx="9" fill={C.panel2} />
      <text x="114" y="62" fontSize="11" fill={C.dim} style={mono}>yourcompany.com</text>
      <line x1="32" y1="76" x2="328" y2="76" stroke={C.soft} />
      <rect x="52" y="96" width="120" height="12" rx="4" fill={C.text} opacity="0.85" />
      <rect x="52" y="116" width="96" height="12" rx="4" fill={C.text} opacity="0.85" />
      <rect x="52" y="140" width="110" height="6" rx="3" fill={C.faint} />
      <rect x="52" y="152" width="90" height="6" rx="3" fill={C.faint} />
      <rect x="52" y="172" width="64" height="20" rx="6" fill={C.red} />
      <rect x="188" y="92" width="120" height="100" rx="8" fill={C.blueSoft} stroke={C.blue} strokeOpacity="0.5" />
      <path d="M188 172 L222 140 L246 160 L270 132 L308 172 V184 a8 8 0 0 1 -8 8 H196 a8 8 0 0 1 -8 -8Z" fill={C.blue} opacity="0.45" />
      {[52, 140, 228].map((x) => (
        <rect key={x} x={x} y="208" width="80" height="48" rx="8" fill={C.panel2} stroke={C.soft} />
      ))}
      <path d="M328 120 C 360 120, 360 92, 384 92" fill="none" stroke={C.dim} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M328 200 C 360 200, 360 228, 384 228" fill="none" stroke={C.dim} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M392 104 a18 18 0 0 1 10 -32 a24 24 0 0 1 44 6 a16 16 0 0 1 2 32 H400 a10 10 0 0 1 -8 -6Z" fill={C.panel2} stroke={C.line} />
      <text x="420" y="136" fontSize="13" fill={C.dim} textAnchor="middle" style={mono}>Cloud</text>
      <rect x="388" y="196" width="64" height="64" rx="8" fill={C.panel2} stroke={C.line} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1="398" y1={210 + i * 18} x2="426" y2={210 + i * 18} stroke={C.faint} strokeWidth="2" strokeLinecap="round" />
          <circle cx="440" cy={210 + i * 18} r="3" fill={C.ok} />
        </g>
      ))}
      <text x="420" y="282" fontSize="13" fill={C.dim} textAnchor="middle" style={mono}>Self-hosted</text>
    </Frame>
  );
}

function Finance() {
  const bars = [62, 74, 58, 86, 92, 118];
  return (
    <Frame label="Paid invoice and a cash flow chart">
      <rect x="44" y="36" width="204" height="252" rx="12" fill={C.panel} stroke={C.line} />
      <text x="64" y="66" fontSize="16" fill={C.text} style={sans}>Invoice</text>
      <text x="228" y="66" fontSize="13" fill={C.dim} textAnchor="end" style={mono}>INV-0142</text>
      <line x1="64" y1="80" x2="228" y2="80" stroke={C.soft} />
      {[
        ["Support plan, 1 yr", "12,000"],
        ["Laptop setup ×8", "4,800"],
        ["Email migration", "1,600"],
      ].map(([a, b], i) => (
        <g key={a}>
          <text x="64" y={106 + i * 26} fontSize="13" fill={C.dim} style={sans}>{a}</text>
          <text x="228" y={106 + i * 26} fontSize="13" fill={C.text} textAnchor="end" style={mono}>{b}</text>
        </g>
      ))}
      <line x1="64" y1="178" x2="228" y2="178" stroke={C.soft} />
      <text x="64" y="204" fontSize="13" fill={C.dim} style={sans}>Total</text>
      <text x="228" y="206" fontSize="18" fill={C.text} textAnchor="end" style={mono}>AED 18,400</text>
      <rect x="64" y="234" width="72" height="28" rx="6" fill={C.blueSoft} stroke={C.ok} strokeOpacity="0.6" />
      <text x="100" y="253" fontSize="13" fill={C.ok} textAnchor="middle" style={mono}>Paid</text>
      <rect x="264" y="76" width="180" height="184" rx="12" fill={C.panel} stroke={C.line} />
      <text x="282" y="104" fontSize="13" fill={C.dim} style={sans}>Cash in, 6 months</text>
      {[0, 1, 2].map((i) => (
        <line key={i} x1="282" y1={140 + i * 36} x2="426" y2={140 + i * 36} stroke={C.soft} />
      ))}
      {bars.map((h, i) => (
        <rect key={i} x={286 + i * 24} y={236 - h} width="14" height={h} rx="3" fill={i === bars.length - 1 ? C.red : C.panel3} />
      ))}
      <text x="282" y="252" fontSize="11" fill={C.dim} style={mono}>Jun</text>
      <text x="426" y="252" fontSize="11" fill={C.dim} textAnchor="end" style={mono}>Nov</text>
    </Frame>
  );
}

function Crm() {
  const cols = [
    { title: "New", count: 3 },
    { title: "Proposal", count: 2 },
    { title: "Won", count: 2 },
  ];
  return (
    <Frame label="Sales pipeline with a lead that needs a follow-up today">
      {cols.map((c, ci) => {
        const x = 32 + ci * 144;
        return (
          <g key={c.title}>
            <rect x={x} y="36" width="132" height="252" rx="12" fill={C.panel} stroke={C.line} />
            <text x={x + 16} y="62" fontSize="13" fill={C.text} style={sans}>{c.title}</text>
            <text x={x + 116} y="62" fontSize="12" fill={C.dim} textAnchor="end" style={mono}>{c.count}</text>
            {Array.from({ length: c.count }).map((_, i) => {
              const y = 78 + i * 64;
              const hot = ci === 1 && i === 0;
              return (
                <g key={i}>
                  <rect x={x + 10} y={y} width="112" height="54" rx="8" fill={C.panel2} stroke={hot ? C.red : C.soft} />
                  <circle cx={x + 26} cy={y + 18} r="7" fill={ci === 2 ? C.blueSoft : C.panel3} />
                  <rect x={x + 40} y={y + 14} width={i % 2 ? 50 : 64} height="7" rx="3.5" fill={C.faint} />
                  {hot ? (
                    <text x={x + 20} y={y + 43} fontSize="11" fill={C.redInk} style={mono}>Follow up today</text>
                  ) : (
                    <text x={x + 20} y={y + 43} fontSize="11" fill={C.dim} style={mono}>
                      {["AED 9,500", "AED 24,000", "AED 6,200"][i]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}

function Erp() {
  const nodes = [
    { label: "Sales", x: 96, y: 72 },
    { label: "Purchasing", x: 384, y: 72 },
    { label: "Inventory", x: 64, y: 172 },
    { label: "Finance", x: 416, y: 172 },
    { label: "HR", x: 128, y: 262 },
    { label: "Production", x: 352, y: 262 },
  ];
  return (
    <Frame label="ERP modules connected to one shared database">
      {nodes.map((n) => (
        <line key={n.label} x1="240" y1="166" x2={n.x} y2={n.y} stroke={C.line} strokeWidth="1.5" />
      ))}
      <rect x="160" y="113" width="10" height="10" fill={C.red} transform="rotate(45 165 118)" />
      <g>
        <ellipse cx="240" cy="132" rx="44" ry="12" fill={C.blueSoft} stroke={C.blue} />
        <path d="M196 132 V196 a44 12 0 0 0 88 0 V132" fill={C.panel2} stroke={C.blue} />
        <ellipse cx="240" cy="132" rx="44" ry="12" fill={C.blueSoft} stroke={C.blue} />
        <path d="M196 154 a44 12 0 0 0 88 0 M196 176 a44 12 0 0 0 88 0" fill="none" stroke={C.blue} strokeOpacity="0.5" />
      </g>
      {nodes.map((n) => {
        const w = n.label.length * 8 + 28;
        return (
          <g key={n.label}>
            <rect x={n.x - w / 2} y={n.y - 18} width={w} height="36" rx="8" fill={C.panel} stroke={C.line} />
            <text x={n.x} y={n.y + 5} fontSize="13" fill={C.text} textAnchor="middle" style={sans}>{n.label}</text>
          </g>
        );
      })}
    </Frame>
  );
}

function Stock() {
  return (
    <Frame label="Warehouse shelf, barcode scan and a low-stock alert">
      <rect x="36" y="36" width="250" height="252" rx="10" fill="none" stroke={C.line} strokeWidth="2" />
      {[116, 196].map((y) => (
        <rect key={y} x="36" y={y} width="250" height="6" fill={C.panel3} />
      ))}
      {[
        [52, 56, 60, 60], [120, 72, 48, 44], [176, 50, 92, 66],
        [52, 140, 70, 56], [130, 128, 56, 68], [194, 148, 76, 48],
        [52, 218, 84, 64], [144, 236, 56, 46], [208, 226, 62, 56],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill={i === 4 ? C.panel3 : C.panel2} stroke={C.soft} />
          <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h * 0.4} stroke={C.faint} strokeWidth="3" />
        </g>
      ))}
      <rect x="138" y="166" width="40" height="22" rx="2" fill="#ffffff" stroke={C.line} />
      {[0, 3, 5, 8, 10, 13, 16, 18, 21, 24, 27, 30, 33].map((d, i) => (
        <rect key={i} x={142 + d} y="169" width={i % 3 ? 1.5 : 2.5} height="14" fill="#1d2939" />
      ))}
      <path d="M178 177 L332 112" stroke={C.red} strokeWidth="2" />
      <path d="M178 177 L332 112" stroke={C.red} strokeWidth="8" strokeOpacity="0.15" />
      <rect x="324" y="56" width="64" height="112" rx="14" fill={C.panel} stroke={C.line} transform="rotate(-18 356 112)" />
      <rect x="334" y="72" width="44" height="40" rx="6" fill={C.panel3} transform="rotate(-18 356 112)" />
      <rect x="300" y="196" width="152" height="92" rx="12" fill={C.panel} stroke={C.line} />
      <text x="316" y="222" fontSize="12" fill={C.dim} style={mono}>SKU 4471</text>
      <text x="316" y="248" fontSize="18" fill={C.text} style={mono}>12 left</text>
      <rect x="316" y="261" width="7" height="7" fill={C.red} transform="rotate(45 319.5 264.5)" />
      <text x="330" y="270" fontSize="12" fill={C.redInk} style={mono}>Reorder at 20</text>
    </Frame>
  );
}

function Factory() {
  return (
    <Frame label="Production line with a robotic arm and live OEE gauge">
      <rect x="36" y="36" width="164" height="112" rx="12" fill={C.panel} stroke={C.line} />
      <text x="54" y="62" fontSize="13" fill={C.dim} style={sans}>Line 2 · OEE</text>
      <path d="M68 128 A50 50 0 0 1 168 128" fill="none" stroke={C.panel3} strokeWidth="10" strokeLinecap="round" />
      <path d="M68 128 A50 50 0 0 1 157 99" fill="none" stroke={C.blue} strokeWidth="10" strokeLinecap="round" />
      <text x="118" y="126" fontSize="20" fill={C.text} textAnchor="middle" style={mono}>82%</text>
      <rect x="24" y="236" width="432" height="20" rx="10" fill={C.panel2} stroke={C.line} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={44 + i * 36} cy="246" r="5" fill={C.panel3} stroke={C.soft} />
      ))}
      {[56, 150, 330].map((x) => (
        <rect key={x} x={x} y="204" width="40" height="32" rx="4" fill={C.panel3} stroke={C.soft} />
      ))}
      <rect x="252" y="256" width="72" height="36" rx="4" fill={C.panel} stroke={C.line} />
      <rect x="270" y="196" width="36" height="16" rx="4" fill={C.panel2} stroke={C.line} />
      <path d="M288 196 L264 120 L208 150" fill="none" stroke={C.text} strokeOpacity="0.8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="288" cy="196" r="10" fill={C.panel3} stroke={C.line} />
      <circle cx="264" cy="120" r="9" fill={C.panel3} stroke={C.line} />
      <path d="M208 150 L198 176 M208 150 L222 174" stroke={C.text} strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" />
      <rect x="196" y="186" width="34" height="18" rx="3" fill={C.panel3} stroke={C.soft} />
      <rect x="420" y="96" width="20" height="140" fill={C.panel2} />
      <rect x="412" y="40" width="36" height="20" rx="4" fill={C.red} />
      <rect x="412" y="60" width="36" height="20" fill={C.panel3} />
      <rect x="412" y="80" width="36" height="20" rx="0" fill={C.panel3} />
      <text x="400" y="54" fontSize="12" fill={C.redInk} textAnchor="end" style={mono}>Stopped 4 min</text>
    </Frame>
  );
}

export function ServiceArt({ kind }: { kind: ServiceIcon }) {
  switch (kind) {
    case "managed":
      return <ManagedIT />;
    case "apps":
      return <Apps />;
    case "web":
      return <Web />;
    case "finance":
      return <Finance />;
    case "crm":
      return <Crm />;
    case "erp":
      return <Erp />;
    case "stock":
      return <Stock />;
    case "factory":
      return <Factory />;
  }
}
