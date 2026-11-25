import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type SmcView = 'mss' | 'fractal' | 'pd';

export function SmcStructureLab() {
  const [view, setView] = useState<SmcView>('mss');
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.smc-path', { strokeDashoffset: 500, duration: 0.9, ease: 'power2.out' });
        gsap.from('.smc-pop', { opacity: 0, y: 8, duration: 0.45, stagger: 0.07, ease: 'power3.out' });
        gsap.from('.smc-zone', { opacity: 0, scaleY: 0, transformOrigin: 'center center', duration: 0.55, stagger: 0.08 });
      });
    },
    { scope: scopeRef, dependencies: [view], revertOnUpdate: true }
  );

  return (
    <div ref={scopeRef} className="surface-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Laboratorio Interactivo · Módulo 01
          </span>
          <h4 className="font-display text-2xl mt-0.5">Anatomía Estructural en Vivo</h4>
        </div>
        <div className="inline-flex rounded-lg p-1 border hairline" style={{ backgroundColor: 'var(--bg)' }}>
          {(
            [
              ['mss', 'BOS / CHoCH / MSS'],
              ['fractal', 'Swing vs. Interna'],
              ['pd', 'Premium / Discount'],
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
          {view === 'mss' && (
            <>
              {/* Downtrend LH/LL then Displacement MSS */}
              <polyline
                points="35,55 95,120 145,88 215,175 268,142 335,205 385,112 448,148 545,56"
                className="smc-path"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.6"
                strokeDasharray="500"
                strokeDashoffset="0"
              />
              {/* BOS Bearish */}
              <line x1="95" y1="120" x2="215" y2="120" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 3" className="smc-pop" />
              <text x="155" y="113" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--muted)" className="smc-pop">BOS</text>
              {/* MSS Bullish with Displacement */}
              <line x1="268" y1="142" x2="385" y2="142" stroke="var(--ink)" strokeWidth="1.5" className="smc-pop" />
              <text x="326" y="134" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="600" fill="var(--ink)" className="smc-pop">
                MSS (Cuerpo &gt; 1.5×ATR + Vol &gt; 1.2×SMA)
              </text>
              {/* Highlight displacement candle */}
              <rect x="364" y="114" width="12" height="58" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.6" className="smc-pop" />
              {/* BOS Bullish continuation */}
              <line x1="385" y1="112" x2="545" y2="112" stroke="var(--ink)" strokeWidth="1" strokeDasharray="4 3" className="smc-pop" />
              <text x="465" y="105" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--ink)" className="smc-pop">BOS Alcista</text>
              {/* Volume bars at bottom */}
              {[95, 145, 215, 268, 335, 370, 448, 510].map((x, i) => {
                const h = i === 5 ? 44 : 14 + (i % 3) * 6;
                return (
                  <rect
                    key={x}
                    x={x - 5}
                    y={230 - h}
                    width="10"
                    height={h}
                    fill={i === 5 ? 'var(--accent)' : 'var(--border)'}
                    className="smc-pop"
                  />
                );
              })}
              <text x="370" y="182" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--accent)" className="smc-pop">
                RVOL &gt; 1.2x
              </text>
            </>
          )}

          {view === 'fractal' && (
            <>
              {/* Macro Swing Wave */}
              <polyline
                points="40,195 250,48 410,160 560,34"
                className="smc-path"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeDasharray="500"
                strokeDashoffset="0"
              />
              {/* Internal Waves inside pullback */}
              <polyline
                points="250,48 288,108 314,82 355,142 380,118 410,160 442,102 465,126 515,62"
                className="smc-path"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.15"
                strokeDasharray="3 3"
              />
              <circle cx="40" cy="195" r="3.5" fill="var(--ink)" className="smc-pop" />
              <circle cx="250" cy="48" r="3.5" fill="var(--ink)" className="smc-pop" />
              <circle cx="410" cy="160" r="3.5" fill="var(--ink)" className="smc-pop" />
              <text x="250" y="36" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="var(--ink)" className="smc-pop">
                Swing High (25 velas)
              </text>
              <text x="410" y="178" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="var(--ink)" className="smc-pop">
                Higher Low (Discount)
              </text>
              <line x1="380" y1="118" x2="442" y2="118" stroke="var(--accent)" strokeWidth="1.2" className="smc-pop" />
              <text x="412" y="112" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--accent)" className="smc-pop">
                iMSS temprano (5 velas)
              </text>
              <line x1="250" y1="48" x2="555" y2="48" stroke="var(--ink)" strokeWidth="1" strokeDasharray="4 3" className="smc-pop" />
              <text x="495" y="42" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--ink)" className="smc-pop">
                Swing BOS
              </text>
            </>
          )}

          {view === 'pd' && (
            <>
              {/* Premium Zone */}
              <rect x="60" y="32" width="480" height="88" fill="var(--imbalance)" fillOpacity="0.65" className="smc-zone" />
              {/* Discount Zone */}
              <rect x="60" y="120" width="480" height="88" fill="var(--imbalance)" fillOpacity="0.22" className="smc-zone" />
              {/* Boundaries */}
              <line x1="60" y1="32" x2="540" y2="32" stroke="var(--ink)" strokeWidth="1" className="smc-pop" />
              <line x1="60" y1="120" x2="540" y2="120" stroke="var(--muted)" strokeWidth="1.1" strokeDasharray="4 4" className="smc-pop" />
              <line x1="60" y1="208" x2="540" y2="208" stroke="var(--ink)" strokeWidth="1" className="smc-pop" />

              <text x="534" y="46" textAnchor="end" fontSize="9" fontFamily="monospace" fill="var(--muted)" className="smc-pop">
                100% · PREMIUM (Zona de Ventas · +20 pts Short)
              </text>
              <text x="534" y="115" textAnchor="end" fontSize="9" fontFamily="monospace" fill="var(--ink)" className="smc-pop">
                50% · EQUILIBRIUM
              </text>
              <text x="534" y="201" textAnchor="end" fontSize="9" fontFamily="monospace" fill="var(--ink)" className="smc-pop">
                0% · DISCOUNT (Zona de Compras · +20 pts Long)
              </text>

              {/* Price dipping into Discount and rallying */}
              <polyline
                points="72,208 210,32 325,168 380,148 495,52"
                className="smc-path"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeDasharray="500"
                strokeDashoffset="0"
              />
              <circle cx="325" cy="168" r="5" fill="var(--accent)" className="smc-pop" />
              <text x="325" y="186" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--accent)" className="smc-pop">
                Reacción óptima en Discount
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
