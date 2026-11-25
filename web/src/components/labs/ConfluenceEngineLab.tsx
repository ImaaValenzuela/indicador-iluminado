import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Pillar {
  id: 'manip' | 'struct' | 'zone' | 'poi' | 'vol';
  pts: number;
  longLabel: string;
  shortLabel: string;
  desc: string;
}

const PILLARS: Pillar[] = [
  { id: 'manip', pts: 25, longLabel: 'Spring / SSL Sweep', shortLabel: 'UTAD / BSL Sweep', desc: 'Barrido de liquidez + cierre de vuelta al rango' },
  { id: 'struct', pts: 25, longLabel: 'MSS / SOS Alcista', shortLabel: 'MSS / SOW Bajista', desc: 'Ruptura con desplazamiento (ATR + Volumen)' },
  { id: 'zone', pts: 20, longLabel: 'Zona Discount (< 50%)', shortLabel: 'Zona Premium (> 50%)', desc: 'Precio reaccionando en zona de valor favorable' },
  { id: 'poi', pts: 15, longLabel: 'OB+ / FVG+ Activo', shortLabel: 'OB- / FVG- Activo', desc: 'POI sin mitigar en origen del impulso o cercano' },
  { id: 'vol', pts: 15, longLabel: 'VSA Absorción / ST / LPS', shortLabel: 'VSA Absorción / ST / LPSY', desc: 'Confirmación institucional por volumen relativo' },
];

export function ConfluenceEngineLab() {
  const [dir, setDir] = useState<'LONG' | 'SHORT'>('LONG');
  const [active, setActive] = useState<Record<Pillar['id'], boolean>>({
    manip: true,
    struct: true,
    zone: true,
    poi: true,
    vol: false,
  });

  const scopeRef = useRef<HTMLDivElement>(null);
  const scoreNumRef = useRef<HTMLSpanElement>(null);
  const prevScoreRef = useRef(85);

  const score = PILLARS.reduce((sum, p) => (active[p.id] ? sum + p.pts : sum), 0);
  const isAPlus = score >= 75;
  const isStd = score >= 50 && score < 75;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const obj = { val: prevScoreRef.current };
        gsap.to(obj, {
          val: score,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            if (scoreNumRef.current) {
              scoreNumRef.current.textContent = String(Math.round(obj.val));
            }
          },
        });
        prevScoreRef.current = score;

        gsap.to('.score-bar-fill', {
          width: `${score}%`,
          duration: 0.45,
          ease: 'power2.out',
        });

        gsap.fromTo('.sim-shadow-line', { strokeDashoffset: 220 }, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.out' });
      });
    },
    { scope: scopeRef, dependencies: [score, dir] }
  );

  const toggle = (id: Pillar['id']) => setActive((prev) => ({ ...prev, [id]: !prev[id] }));

  const applyPreset = (preset: 'perfect' | 'aplus' | 'std' | 'weak') => {
    if (preset === 'perfect') setActive({ manip: true, struct: true, zone: true, poi: true, vol: true });
    if (preset === 'aplus') setActive({ manip: true, struct: true, zone: true, poi: true, vol: false });
    if (preset === 'std') setActive({ manip: false, struct: true, zone: true, poi: true, vol: false });
    if (preset === 'weak') setActive({ manip: false, struct: false, zone: true, poi: false, vol: false });
  };

  const ghostPoints =
    dir === 'LONG'
      ? score >= 75
        ? '20,96 72,102 128,60 194,28'
        : score >= 50
          ? '20,96 72,88 128,74 194,54'
          : '20,76 72,66 128,86 194,74'
      : score >= 75
        ? '20,34 72,28 128,72 194,104'
        : score >= 50
          ? '20,34 72,44 128,62 194,82'
          : '20,76 72,86 128,66 194,78';

  const ghostCone =
    dir === 'LONG' && score >= 50
      ? '20,96 72,88 128,44 194,10 194,58 128,82 72,116'
      : dir === 'SHORT' && score >= 50
        ? '20,34 72,16 128,50 194,78 194,122 128,92 72,46'
        : '20,76 72,54 128,58 194,48 194,100 128,100 72,94';

  return (
    <div ref={scopeRef} className="surface-card rounded-2xl p-5 sm:p-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Simulador Interactivo · Motor 0–100 + Modo Sombra
          </span>
          <h4 className="font-display text-3xl mt-1">Probá la Confluencia en Tiempo Real</h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-1 border hairline" style={{ backgroundColor: 'var(--bg)' }}>
            {(['LONG', 'SHORT'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDir(d)}
                className="focus-ring px-3 py-1 text-xs font-mono rounded-md cursor-pointer transition-colors"
                style={{
                  backgroundColor: dir === d ? 'var(--pill-bg)' : 'transparent',
                  color: dir === d ? 'var(--pill-ink)' : 'var(--muted)',
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => applyPreset('perfect')}
            className="focus-ring px-2.5 py-1.5 text-[11px] font-mono rounded-md border hairline cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
          >
            100 pts
          </button>
          <button
            type="button"
            onClick={() => applyPreset('aplus')}
            className="focus-ring px-2.5 py-1.5 text-[11px] font-mono rounded-md border hairline cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
          >
            85 A+
          </button>
          <button
            type="button"
            onClick={() => applyPreset('std')}
            className="focus-ring px-2.5 py-1.5 text-[11px] font-mono rounded-md border hairline cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
          >
            60 Estándar
          </button>
          <button
            type="button"
            onClick={() => applyPreset('weak')}
            className="focus-ring px-2.5 py-1.5 text-[11px] font-mono rounded-md border hairline cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
          >
            20 Ruido
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Interactive Pillar Toggles */}
        <div className="lg:col-span-7 space-y-2.5">
          {PILLARS.map((p) => {
            const on = active[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className="focus-ring w-full text-left flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-all cursor-pointer"
                style={{
                  backgroundColor: on ? 'var(--bg)' : 'transparent',
                  borderColor: on ? 'var(--ink)' : 'var(--border)',
                  opacity: on ? 1 : 0.65,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex items-center justify-center w-4 h-4 rounded-sm border text-[10px] font-mono shrink-0"
                    style={{
                      backgroundColor: on ? 'var(--pill-bg)' : 'transparent',
                      borderColor: on ? 'var(--pill-bg)' : 'var(--subtle)',
                      color: 'var(--pill-ink)',
                    }}
                  >
                    {on ? '✓' : ''}
                  </span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                      {dir === 'LONG' ? p.longLabel : p.shortLabel}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {p.desc}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs tabular-nums shrink-0" style={{ color: on ? 'var(--accent)' : 'var(--muted)' }}>
                  +{p.pts} pts
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Live Score + Minimalist Dashboard + Live Shadow Mode Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="rounded-xl border hairline p-5" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Puntaje de Confluencia
              </span>
              <span className="font-mono text-3xl tabular-nums">
                <span ref={scoreNumRef}>{score}</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}> / 100</span>
              </span>
            </div>

            {/* Score progress bar with 50 & 75 thresholds */}
            <div className="relative h-2 rounded-full mt-3 overflow-hidden" style={{ backgroundColor: 'var(--surface-strong)' }}>
              <div
                className="score-bar-fill h-full rounded-full"
                style={{
                  width: `${score}%`,
                  backgroundColor: isAPlus ? 'var(--ink)' : isStd ? 'var(--accent)' : 'var(--subtle)',
                }}
              />
              <div className="absolute top-0 bottom-0 left-[50%] w-px" style={{ backgroundColor: 'var(--bg)' }} />
              <div className="absolute top-0 bottom-0 left-[75%] w-px" style={{ backgroundColor: 'var(--bg)' }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono mt-1.5" style={{ color: 'var(--muted)' }}>
              <span>0</span>
              <span>50 (▲/▼)</span>
              <span>75 (A+)</span>
              <span>100</span>
            </div>

            {/* Output Badge Preview */}
            <div className="mt-5 pt-4 border-t hairline flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                Etiqueta en Gráfico:
              </span>
              {isAPlus ? (
                <span
                  className="px-3 py-1 rounded text-xs font-mono tracking-wide"
                  style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--pill-ink)' }}
                >
                  A+ {dir} · {score}
                </span>
              ) : isStd ? (
                <span className="text-xs font-mono font-medium" style={{ color: 'var(--ink)' }}>
                  {dir === 'LONG' ? '▲ LONG' : '▼ SHORT'} ({score})
                </span>
              ) : (
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                  Filtrado (Sin Señal)
                </span>
              )}
            </div>
          </div>

          {/* Mini Shadow Mode Preview + Dashboard summary */}
          <div className="rounded-xl border hairline p-4" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="flex items-center justify-between text-[11px] font-mono mb-2" style={{ color: 'var(--muted)' }}>
              <span>Modo Sombra · Proyección ATR</span>
              <span style={{ color: 'var(--ink)' }}>
                {score >= 50 ? (dir === 'LONG' ? 'Est. Alcista' : 'Est. Bajista') : 'Rango Neutral'}
              </span>
            </div>
            <svg viewBox="0 0 214 130" className="w-full h-auto block">
              <polygon points={ghostCone} fill="var(--imbalance)" fillOpacity="0.8" />
              <polyline
                points={ghostPoints}
                className="sim-shadow-line"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.4"
                strokeDasharray="220"
                strokeDashoffset="0"
              />
              <circle cx="20" cy={dir === 'LONG' && score >= 50 ? 96 : dir === 'SHORT' && score >= 50 ? 34 : 76} r="3" fill="var(--ink)" />
              <circle cx="194" cy={Number(ghostPoints.split(' ').at(-1)?.split(',')[1] ?? 70)} r="3.2" fill="var(--accent)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
