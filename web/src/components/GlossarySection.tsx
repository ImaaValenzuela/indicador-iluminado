import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY } from '../data/curriculum';
import type { GlossaryItem } from '../types/curriculum';

const CATEGORIES: Array<'Todos' | GlossaryItem['category']> = [
  'Todos',
  'SMC',
  'Liquidez & POIs',
  'Wyckoff & VSA',
  'Motor',
];

export function GlossarySection() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<'Todos' | GlossaryItem['category']>('Todos');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((item) => {
      const catOk = cat === 'Todos' || item.category === cat;
      if (!catOk) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <section id="glossary" className="py-24 sm:py-28 border-t hairline">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Referencia Rápida A–Z
            </span>
            <h2 className="font-display text-4xl sm:text-5xl mt-1">Glosario Institucional</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--muted)' }}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar término, sigla o fórmula..."
                className="focus-ring pl-9 pr-3.5 py-2 text-xs font-mono rounded-lg border hairline w-full sm:w-64"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)' }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className="focus-ring px-3 py-1.5 text-[11px] font-mono rounded-lg border hairline cursor-pointer transition-colors"
                  style={{
                    backgroundColor: cat === c ? 'var(--pill-bg)' : 'transparent',
                    color: cat === c ? 'var(--pill-ink)' : 'var(--muted)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card rounded-2xl p-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
            No se encontraron términos para &ldquo;{query}&rdquo;. Probá con <code>MSS</code>, <code>FVG</code> o <code>Spring</code>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.term}
                className="rounded-xl border hairline p-4 flex flex-col justify-between transition-colors"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                      {item.term}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--accent)' }}>
                    {item.fullName}
                  </div>
                  <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--muted)' }}>
                    {item.definition}
                  </p>
                </div>

                {item.formula && (
                  <div
                    className="mt-3 px-2.5 py-1.5 rounded border hairline text-[11px] font-mono tabular-nums"
                    style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
                  >
                    {item.formula}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
