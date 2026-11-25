import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type PoiView = 'sweep' | 'ob' | 'fvg';

export function LiquidityPoiLab() {
  const [view, setView] = useState<PoiView>('sweep');
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.poi-path', { strokeDashoffset: 480, duration: 0.85, ease: 'power2.out' });
        gsap.from('.poi-box', { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.55, stagger: 0.1 });
        gsap.from('.poi-item', { opacity: 0, y: 8, duration: 0.4, stagger: 0.06 });
      });
    },
    { scope: scopeRef, dependencies: [view], revertOnUpdate: true }
  );

  return (
    <div ref={scopeRef} className="surface-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Laboratorio Interactivo · Módulo 02
          </span>
          <h4 className="font-display text-2xl mt-0.5">Liquidez, Order Blocks e Imbalances</h4>
        </div>
        <div className="inline-flex rounded-lg p-1 border hairline" style={{ backgroundColor: 'var(--bg)' }}>
          {(
            [
              ['sweep', 'EQH/EQL & Sweep ×'],
              ['ob', 'OB → Breaker Block'],
              ['fvg', 'FVG (Recorte Gris)'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className="focus-ring px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer"
              style={{
                backgroundColor: view === id ? 'var(--pill-bg)' : 'transparent',
                color: view === id ? 'var(--pill-ink)' : 'var(--muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border hairline overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        <svg viewBox="0 0 600 240" className="w-full h-auto block">
          {view === 'sweep' && (
            <>
              {/* EQL dotted line */}
              <line x1="70" y1="168" x2="395" y2="168" stroke="var(--muted)" strokeWidth="1.1" strokeDasharray="3 3" className="poi-item" />
              <text x="155" y="182" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--muted)" className="poi-item">
                $$$ EQL (Diferencia &lt; 0.15×ATR)
              </text>

              {/* Price hitting twice then sweeping with wick */}
              <polyline
                points="45,95 105,168 155,118 215,167 278,108 345,162"
                className="poi-path"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.6"
                strokeDasharray="480"
                strokeDashoffset="0"
              />
              {/* Sweep Candle */}
              <g className="poi-item">
                <line x1="358" y1="138" x2="358" y2="206" stroke="var(--ink)" strokeWidth="1.5" />
                <rect x="351" y="146" width="14" height="18" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.5" />
                <text x="358" y="222" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="600" fill="var(--ink)">
                  × SSL Sweep (Mecha barre · Cierre adentro)
                </text>
              </g>
              {/* Reaction up */}
              <polyline
                points="365,146 445,76 535,44"
                className="poi-path"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeDasharray="480"
                strokeDashoffset="0"
              />
              <text x="488" y="66" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--accent)" className="poi-item">
                +25 pts Manipulación
              </text>
            </>
          )}

          {view === 'ob' && (
            <>
              {/* Active OB+ on left */}
              <rect x="92" y="138" width="180" height="36" fill="var(--imbalance)" stroke="var(--ink)" strokeWidth="1" className="poi-box" />
              <line x1="92" y1="156" x2="272" y2="156" stroke="var(--muted)" strokeWidth="0.8" strokeDasharray="3 3" className="poi-item" />
              <text x="100" y="151" fontSize="8.5" fontFamily="monospace" fill="var(--ink)" className="poi-item">OB+ (Soporte · 50% MT)</text>

              {/* Converted Breaker Block BB- on right */}
              <rect x="272" y="138" width="250" height="36" fill="var(--imbalance)" fillOpacity="0.45" stroke="var(--muted)" strokeWidth="1.1" strokeDasharray="3 3" className="poi-box" />
              <text x="514" y="159" textAnchor="end" fontSize="8.5" fontFamily="monospace" fill="var(--muted)" className="poi-item">
                BB- (Breaker · Resistencia)
              </text>

              {/* Price: holds OB+ first, then breaks distally, retests as BB- and drops */}
              <polyline
                points="55,110 98,162 155,72 205,154 248,98 308,204 388,158 498,222"
                className="poi-path"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.6"
                strokeDasharray="480"
                strokeDashoffset="0"
              />
              {/* Last bearish OB candle */}
              <rect x="92" y="142" width="12" height="28" fill="var(--ink)" className="poi-item" />
              <circle cx="205" cy="154" r="4" fill="var(--ink)" className="poi-item" />
              <text x="205" y="192" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--muted)" className="poi-item">
                Toque 50%
              </text>
              <circle cx="308" cy="204" r="4" fill="var(--accent)" className="poi-item" />
              <text x="308" y="222" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--accent)" className="poi-item">
                Cierre distal → Invierte a BB-
              </text>
              <circle cx="388" cy="158" r="4" fill="var(--ink)" className="poi-item" />
            </>
          )}

          {view === 'fvg' && (
            <>
              {/* 3 candles creating bullish FVG */}
              <g className="poi-item">
                {/* Candle [2] */}
                <line x1="120" y1="158" x2="120" y2="212" stroke="var(--ink)" strokeWidth="1.2" />
                <rect x="112" y="168" width="16" height="32" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.3" />
                <text x="120" y="226" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">Vela [2]</text>
                {/* Candle [1] Displacement */}
                <line x1="164" y1="74" x2="164" y2="176" stroke="var(--ink)" strokeWidth="1.2" />
                <rect x="156" y="84" width="16" height="84" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.5" />
                <text x="164" y="226" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink)">Impulso</text>
                {/* Candle [0] */}
                <line x1="208" y1="42" x2="208" y2="106" stroke="var(--ink)" strokeWidth="1.2" />
                <rect x="200" y="54" width="16" height="40" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.3" />
                <text x="208" y="226" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">Actual</text>
              </g>

              {/* Original Full Gray FVG Box */}
              <rect x="164" y="106" width="170" height="52" fill="var(--imbalance)" stroke="var(--imbalance-border)" strokeWidth="1" className="poi-box" />
              <text x="249" y="135" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--ink)" className="poi-item">
                FVG+ (&gt; 0.25×ATR)
              </text>

              {/* Trimmed FVG after partial fill */}
              <rect x="334" y="130" width="190" height="28" fill="var(--imbalance)" stroke="var(--imbalance-border)" strokeWidth="1" className="poi-box" />
              <text x="429" y="147" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--muted)" className="poi-item">
                Recorte progresivo (50% → 100%)
              </text>

              {/* Pullback filling top half and continuing */}
              <polyline
                points="216,66 285,84 334,130 415,62 520,38"
                className="poi-path"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeDasharray="480"
                strokeDashoffset="0"
              />
              <circle cx="334" cy="130" r="4" fill="var(--accent)" className="poi-item" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
