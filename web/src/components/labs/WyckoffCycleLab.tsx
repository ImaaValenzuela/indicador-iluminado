import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type WyckoffBias = 'acum' | 'dist';
type PhaseIdx = 0 | 1 | 2 | 3 | 4;

interface PhaseMeta {
  code: string;
  acumTitle: string;
  distTitle: string;
  acumDesc: string;
  distDesc: string;
  rule: string;
  endX: number;
}

const PHASES: PhaseMeta[] = [
  {
    code: 'Fase A',
    acumTitle: 'Parada de Caída (SC + AR)',
    distTitle: 'Parada de Subida (BC + AR)',
    acumDesc: 'Selling Climax (RVOL > 2.2) absorbe pánico vendedor y el Automatic Rally fija el techo del Trading Range.',
    distDesc: 'Buying Climax (RVOL > 2.2) absorbe euforia compradora y la Automatic Reaction fija el piso del Trading Range.',
    rule: 'RVOL > 2.2  ∧  Spread > 1.8 × ATR(14)',
    endX: 185,
  },
  {
    code: 'Fase B',
    acumTitle: 'Construcción de Causa (ST)',
    distTitle: 'Construcción de Causa (ST)',
    acumDesc: 'Secondary Test visita el 25% inferior del rango sin cerrar debajo y con volumen bajo (agotamiento de oferta).',
    distDesc: 'Secondary Test visita el 25% superior del rango sin cerrar arriba y con volumen bajo (agotamiento de demanda).',
    rule: 'Test extremo TR  ∧  RVOL < 0.9',
    endX: 285,
  },
  {
    code: 'Fase C',
    acumTitle: 'Trampa Institucional (SPRING)',
    distTitle: 'Trampa Institucional (UTAD)',
    acumDesc: 'Barrido por debajo del piso del TR que cierra de vuelta adentro en 0–2 velas. +25 pts en Manipulación.',
    distDesc: 'Barrido por encima del techo del TR que cierra de vuelta adentro en 0–2 velas. +25 pts en Manipulación.',
    rule: 'Rompe borde TR → cierra dentro (0–2 velas)',
    endX: 365,
  },
  {
    code: 'Fase D',
    acumTitle: 'Ruptura con Fuerza (SOS)',
    distTitle: 'Ruptura con Debilidad (SOW)',
    acumDesc: 'Sign of Strength rompe el techo del TR con cierre decisivo, spread expansivo y volumen alto. +25 pts Estructura.',
    distDesc: 'Sign of Weakness rompe el piso del TR con cierre decisivo, spread expansivo y volumen alto. +25 pts Estructura.',
    rule: 'Cierre fuera TR  ∧  Spread > 1.3×ATR  ∧  RVOL > 1.5',
    endX: 455,
  },
  {
    code: 'Fase E',
    acumTitle: 'Retest y Markup (LPS)',
    distTitle: 'Retest y Markdown (LPSY)',
    acumDesc: 'Last Point of Support retrocede al borde del TR o a un OB/FVG con sequía de volumen antes de la expansión.',
    distDesc: 'Last Point of Supply retrocede al borde del TR o a un OB/FVG con sequía de volumen antes de la caída.',
    rule: 'Retest borde TR / POI  ∧  RVOL < 0.8',
    endX: 565,
  },
];

// Coordinates for Accumulation path (Distribution mirrors vertically around y=115)
const ACUM_POINTS: [number, number][] = [
  [35, 52],
  [95, 166], // SC
  [158, 92], // AR
  [215, 158], // ST
  [262, 112],
  [318, 188], // SPRING
  [355, 146],
  [428, 72], // SOS
  [478, 94], // LPS
  [558, 36], // Markup
];

const VOL_BARS = [
  { x: 95, h: 42, label: '2.6x', highlight: true },
  { x: 158, h: 24, label: '1.3x', highlight: false },
  { x: 215, h: 12, label: '0.7x', highlight: false },
  { x: 318, h: 36, label: '2.1x', highlight: true },
  { x: 428, h: 38, label: '1.9x', highlight: true },
  { x: 478, h: 10, label: '0.6x', highlight: false },
];

export function WyckoffCycleLab() {
  const [bias, setBias] = useState<WyckoffBias>('acum');
  const [phaseIdx, setPhaseIdx] = useState<PhaseIdx>(2);
  const scopeRef = useRef<HTMLDivElement>(null);

  const meta = PHASES[phaseIdx];
  const mappedPoints = ACUM_POINTS.map(([x, y]) => [x, bias === 'acum' ? y : 220 - y] as [number, number]);
  const visiblePoints = mappedPoints.filter(([x]) => x <= meta.endX);
  const polylineStr = visiblePoints.map(([x, y]) => `${x},${y}`).join(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.wyck-path', { strokeDashoffset: 700, duration: 0.75, ease: 'power2.out' });
        gsap.from('.wyck-meta', { opacity: 0, y: 6, duration: 0.35, ease: 'power2.out' });
      });
    },
    { scope: scopeRef, dependencies: [bias, phaseIdx], revertOnUpdate: true }
  );

  const trTop = bias === 'acum' ? 92 : 54;
  const trBot = bias === 'acum' ? 166 : 128;

  return (
    <div ref={scopeRef} className="surface-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Explorador Interactivo · Fases A – E
          </span>
          <h4 className="font-display text-2xl mt-0.5">
            {bias === 'acum' ? 'Esquema de Acumulación' : 'Esquema de Distribución'}
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-1 border hairline" style={{ backgroundColor: 'var(--bg)' }}>
            {(
              [
                ['acum', 'Acumulación'],
                ['dist', 'Distribución'],
              ] as const
            ).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                onClick={() => setBias(id)}
                className="focus-ring px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer"
                style={{
                  backgroundColor: bias === id ? 'var(--pill-bg)' : 'transparent',
                  color: bias === id ? 'var(--pill-ink)' : 'var(--muted)',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-lg p-1 border hairline" style={{ backgroundColor: 'var(--bg)' }}>
            {PHASES.map((p, i) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setPhaseIdx(i as PhaseIdx)}
                className="focus-ring px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer"
                style={{
                  backgroundColor: phaseIdx === i ? 'var(--accent)' : 'transparent',
                  color: phaseIdx === i ? '#ffffff' : 'var(--muted)',
                }}
              >
                {p.code.replace('Fase ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Diagram + RVOL Histogram */}
      <div className="rounded-xl border hairline overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <svg viewBox="0 0 600 268" className="w-full h-auto block">
          {/* Trading Range Box */}
          <rect
            x="86"
            y={trTop}
            width="368"
            height={trBot - trTop}
            fill="var(--imbalance)"
            fillOpacity="0.45"
            stroke="var(--subtle)"
            strokeWidth="0.9"
            strokeDasharray="3 3"
          />
          <text x="94" y={trTop + 13} fontSize="8.5" fontFamily="monospace" fill="var(--muted)">
            {bias === 'acum' ? 'ACUMULACIÓN' : 'DISTRIBUCIÓN'} · {meta.code.toUpperCase()}
          </text>

          {/* Phase vertical dividers */}
          {[185, 285, 365, 455].map((x, idx) => (
            <line
              key={x}
              x1={x}
              y1={trTop}
              x2={x}
              y2={trBot}
              stroke="var(--subtle)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity={phaseIdx >= idx ? 1 : 0.25}
            />
          ))}

          {/* Ghost full future outline */}
          <polyline
            points={mappedPoints.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Active animated path up to selected phase */}
          <polyline
            points={polylineStr}
            className="wyck-path"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeDasharray="700"
            strokeDashoffset="0"
          />

          {/* Event labels */}
          {[
            { idx: 1, minP: 0, text: bias === 'acum' ? 'SC' : 'BC' },
            { idx: 2, minP: 0, text: 'AR' },
            { idx: 3, minP: 1, text: 'ST' },
            { idx: 5, minP: 2, text: bias === 'acum' ? 'SPRING' : 'UTAD' },
            { idx: 7, minP: 3, text: bias === 'acum' ? 'SOS' : 'SOW' },
            { idx: 8, minP: 4, text: bias === 'acum' ? 'LPS' : 'LPSY' },
          ].map((ev) => {
            if (phaseIdx < ev.minP) return null;
            const [x, y] = mappedPoints[ev.idx];
            const isHighImpact = ev.minP === 2 || ev.minP === 3;
            const dy = bias === 'acum' ? (ev.idx === 2 || ev.idx === 7 ? -10 : 14) : ev.idx === 2 || ev.idx === 7 ? 14 : -10;
            return (
              <g key={ev.text}>
                <circle cx={x} cy={y} r={isHighImpact ? 3.5 : 2.5} fill={isHighImpact ? 'var(--accent)' : 'var(--ink)'} />
                <text
                  x={x}
                  y={y + dy}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={isHighImpact ? '600' : '400'}
                  fill={isHighImpact ? 'var(--ink)' : 'var(--muted)'}
                >
                  {ev.text}
                </text>
              </g>
            );
          })}

          {/* Divider to RVOL panel */}
          <line x1="20" y1="208" x2="580" y2="208" stroke="var(--border)" strokeWidth="0.8" />
          <text x="26" y="220" fontSize="8" fontFamily="monospace" fill="var(--muted)">
            RVOL (Volumen Relativo)
          </text>

          {/* RVOL bars */}
          {VOL_BARS.map((b) => {
            const active = b.x <= meta.endX;
            return (
              <g key={b.x} opacity={active ? 1 : 0.2}>
                <rect
                  x={b.x - 7}
                  y={258 - b.h}
                  width="14"
                  height={b.h}
                  fill={b.highlight ? 'var(--ink)' : 'var(--subtle)'}
                  rx="1"
                />
                <text x={b.x} y={254 - b.h} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="var(--muted)">
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Phase explanation bar */}
      <div className="wyck-meta mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2">
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            {meta.code} · {bias === 'acum' ? meta.acumTitle : meta.distTitle}
          </div>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--ink)' }}>
            {bias === 'acum' ? meta.acumDesc : meta.distDesc}
          </p>
        </div>
        <div
          className="rounded-lg px-3.5 py-2.5 border hairline text-xs font-mono tabular-nums"
          style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
        >
          <span className="block text-[10px] uppercase mb-1">Regla Algorítmica</span>
          <span style={{ color: 'var(--ink)' }}>{meta.rule}</span>
        </div>
      </div>
    </div>
  );
}
