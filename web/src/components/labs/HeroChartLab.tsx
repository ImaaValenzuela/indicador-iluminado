import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

const HERO_CANDLES: Candle[] = [
  { x: 42, open: 95, close: 132, high: 88, low: 142 },
  { x: 68, open: 130, close: 170, high: 122, low: 180 },
  { x: 94, open: 168, close: 214, high: 160, low: 236 }, // SC
  { x: 120, open: 210, close: 168, high: 158, low: 218 },
  { x: 146, open: 168, close: 146, high: 136, low: 176 }, // AR
  { x: 172, open: 150, close: 186, high: 146, low: 196 },
  { x: 198, open: 186, close: 212, high: 180, low: 224 }, // ST
  { x: 224, open: 210, close: 184, high: 178, low: 216 },
  { x: 250, open: 188, close: 220, high: 184, low: 256 }, // SPRING sweep
  { x: 276, open: 216, close: 174, high: 166, low: 222 }, // Displacement
  { x: 302, open: 174, close: 122, high: 114, low: 178 }, // MSS / SOS
  { x: 328, open: 124, close: 144, high: 120, low: 152 }, // LPS pullback
  { x: 354, open: 142, close: 110, high: 102, low: 146 }, // Expansion
];

export function HeroChartLab() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-grid-line', { opacity: 0, duration: 0.5, stagger: 0.05 })
          .from('.hero-candle', { scaleY: 0, opacity: 0, transformOrigin: 'center bottom', duration: 0.45, stagger: 0.045 }, '-=0.25')
          .from('.hero-tr', { opacity: 0, scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '-=0.35')
          .from('.hero-fvg', { opacity: 0, scaleX: 0, transformOrigin: 'left center', duration: 0.5 }, '-=0.25')
          .from('.hero-struct-line', { strokeDashoffset: 220, opacity: 0, duration: 0.7 }, '-=0.3')
          .from('.hero-marker', { opacity: 0, y: 8, duration: 0.4, stagger: 0.08 }, '-=0.35')
          .from('.hero-pill', { opacity: 0, y: 12, scale: 0.94, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.15')
          .from('.hero-ghost-cone', { opacity: 0, duration: 0.7 }, '-=0.2')
          .from('.hero-ghost-path', { strokeDashoffset: 240, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.55');
      });
    },
    { scope: scopeRef }
  );

  return (
    <div
      ref={scopeRef}
      className="relative w-full rounded-2xl border hairline overflow-hidden transition-colors"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Top micro header mimicking clean chart toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b hairline text-[11px] font-mono"
        style={{ color: 'var(--muted)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
          <span style={{ color: 'var(--ink)' }}>BTCUSDT · 15m</span>
          <span>SMC + Wyckoff IE v6</span>
        </div>
        <span className="hidden sm:inline">barstate.isconfirmed · 0% Repintado</span>
      </div>

      {/* Architectural SVG Chart */}
      <svg
        viewBox="0 0 560 300"
        className="w-full h-auto block select-none"
        role="img"
        aria-label="Diagrama animado de Acumulación Wyckoff, FVG gris, Spring, MSS y Modo Sombra"
      >
        {/* Subtle horizontal price grid */}
        {[60, 120, 180, 240].map((y) => (
          <line
            key={y}
            x1="20"
            y1={y}
            x2="540"
            y2={y}
            className="hero-grid-line"
            stroke="var(--border)"
            strokeWidth="0.75"
          />
        ))}

        {/* Wyckoff Accumulation TR Box */}
        <g className="hero-tr">
          <rect
            x="84"
            y="136"
            width="230"
            height="98"
            fill="var(--imbalance)"
            fillOpacity="0.4"
            stroke="var(--subtle)"
            strokeWidth="0.9"
            strokeDasharray="3 3"
          />
          <text x="90" y="148" fontSize="8" fontFamily="monospace" fill="var(--muted)">
            ACUMULACIÓN · FASE A → D
          </text>
          {/* Phase dividers */}
          <line x1="186" y1="136" x2="186" y2="234" stroke="var(--subtle)" strokeWidth="0.7" strokeDasharray="2 3" />
          <line x1="240" y1="136" x2="240" y2="234" stroke="var(--subtle)" strokeWidth="0.7" strokeDasharray="2 3" />
          <line x1="292" y1="136" x2="292" y2="234" stroke="var(--subtle)" strokeWidth="0.7" strokeDasharray="2 3" />
          <text x="135" y="130" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">Fase A</text>
          <text x="212" y="130" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">Fase B</text>
          <text x="266" y="130" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink)">Fase C</text>
          <text x="310" y="130" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink)">Fase D</text>
        </g>

        {/* Gray Imbalance (FVG) Box created on displacement */}
        <g className="hero-fvg">
          <rect
            x="276"
            y="148"
            width="115"
            height="24"
            fill="var(--imbalance)"
            stroke="var(--imbalance-border)"
            strokeWidth="0.9"
          />
          <text x="386" y="163" textAnchor="end" fontSize="7.5" fontFamily="monospace" fill="var(--muted)">
            FVG
          </text>
        </g>

        {/* MSS Structure break line */}
        <line
          x1="146"
          y1="136"
          x2="302"
          y2="136"
          className="hero-struct-line"
          stroke="var(--ink)"
          strokeWidth="1.2"
          strokeDasharray="220"
          strokeDashoffset="0"
        />

        {/* Black & Outline Candlesticks */}
        {HERO_CANDLES.map((c, idx) => {
          const isBull = c.close < c.open;
          const bodyTop = Math.min(c.open, c.close);
          const bodyH = Math.max(4, Math.abs(c.open - c.close));
          return (
            <g key={idx} className="hero-candle">
              <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke="var(--ink)" strokeWidth="1.15" />
              <rect
                x={c.x - 5.5}
                y={bodyTop}
                width="11"
                height={bodyH}
                fill={isBull ? 'var(--bg)' : 'var(--ink)'}
                stroke="var(--ink)"
                strokeWidth="1.2"
                rx="0.5"
              />
            </g>
          );
        })}

        {/* Minimalist Markers */}
        <g className="hero-marker" fontFamily="monospace" fontSize="8.5">
          <text x="94" y="250" textAnchor="middle" fill="var(--muted)">SC</text>
          <text x="198" y="238" textAnchor="middle" fill="var(--muted)">ST</text>
          <text x="250" y="268" textAnchor="middle" fill="var(--ink)" fontWeight="600">× SPRING</text>
          <text x="224" y="129" textAnchor="middle" fill="var(--ink)" fontWeight="600">MSS</text>
          <text x="302" y="106" textAnchor="middle" fill="var(--ink)" fontWeight="600">SOS</text>
          <text x="328" y="164" textAnchor="middle" fill="var(--muted)">LPS</text>
          {/* VSA Absorption micro-dot */}
          <circle cx="250" cy="276" r="2.2" fill="var(--ink)" fillOpacity="0.6" />
        </g>

        {/* A+ LONG Pill */}
        <g className="hero-pill">
          <rect x="266" y="228" width="76" height="19" rx="4" fill="var(--pill-bg)" />
          <text x="304" y="240.5" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--pill-ink)">
            A+ LONG · 90
          </text>
        </g>

        {/* Shadow Mode (Modo Sombra) Cone + Dotted Future Trajectory */}
        <g className="hero-ghost-cone">
          <polygon
            points="354,110 404,106 456,56 518,30 518,86 456,104 404,140"
            fill="var(--imbalance)"
            fillOpacity="0.72"
          />
          <polyline
            points="354,110 404,106 456,56 518,30"
            fill="none"
            stroke="var(--subtle)"
            strokeWidth="0.75"
            strokeDasharray="2 3"
          />
          <polyline
            points="354,110 404,140 456,104 518,86"
            fill="none"
            stroke="var(--subtle)"
            strokeWidth="0.75"
            strokeDasharray="2 3"
          />
        </g>
        <polyline
          points="354,110 404,123 456,80 518,58"
          className="hero-ghost-path"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.6"
          strokeWidth="1.25"
          strokeDasharray="240"
          strokeDashoffset="0"
        />
        <g className="hero-marker">
          <circle cx="518" cy="58" r="2.5" fill="var(--accent)" />
          <text x="518" y="48" textAnchor="end" fontSize="8" fontFamily="monospace" fill="var(--muted)">
            Sombra · Fase E → Markup
          </text>
        </g>

        {/* Mini Replica Dashboard top-right */}
        <g transform="translate(422, 198)" className="hero-marker">
          <rect
            x="0"
            y="0"
            width="124"
            height="86"
            rx="4"
            fill="var(--bg)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <rect x="0" y="0" width="124" height="17" rx="4" fill="var(--surface)" />
          <text x="62" y="11.5" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="var(--ink)">
            SMC · WYCKOFF
          </text>
          {[
            ['Swing', 'Alcista'],
            ['Zona', 'Discount'],
            ['Wyckoff', 'Acum. Fase D'],
            ['Último A+', '90 · LONG'],
            ['Sombra', 'Est. Alcista'],
          ].map(([k, v], i) => (
            <g key={k} transform={`translate(0, ${28 + i * 11.5})`} fontSize="7" fontFamily="monospace">
              <text x="7" y="0" fill="var(--muted)">{k}</text>
              <text x="117" y="0" textAnchor="end" fill="var(--ink)">{v}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
