import { useState } from 'react';
import { Check, ChevronDown, AlertTriangle } from 'lucide-react';
import type { LessonConcept } from '../types/curriculum';

interface ConceptCardProps {
  concept: LessonConcept;
  completed: boolean;
  onToggleComplete: (id: string) => void;
}

export function ConceptCard({ concept, completed, onToggleComplete }: ConceptCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="concept-card rounded-2xl border hairline p-5 sm:p-6 transition-colors flex flex-col justify-between"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span
            className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border hairline"
            style={{ color: 'var(--muted)', backgroundColor: 'var(--surface)' }}
          >
            {concept.tag}
          </span>

          <button
            type="button"
            onClick={() => onToggleComplete(concept.id)}
            aria-pressed={completed}
            className="focus-ring inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0"
            style={{
              backgroundColor: completed ? 'var(--pill-bg)' : 'transparent',
              borderColor: completed ? 'var(--pill-bg)' : 'var(--border)',
              color: completed ? 'var(--pill-ink)' : 'var(--muted)',
            }}
          >
            <Check size={12} />
            <span>{completed ? 'Dominado' : 'Marcar'}</span>
          </button>
        </div>

        <h3 className="font-display text-2xl sm:text-[26px] leading-snug mt-3.5" style={{ color: 'var(--ink)' }}>
          {concept.title}
        </h3>

        <p className="text-sm leading-relaxed mt-2.5" style={{ color: 'var(--muted)' }}>
          {concept.summary}
        </p>

        {concept.formula && (
          <div
            className="mt-4 px-3.5 py-2.5 rounded-lg border hairline text-xs font-mono tabular-nums overflow-x-auto"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)' }}
          >
            {concept.formula}
          </div>
        )}
      </div>

      {/* Expandable institutional depth */}
      <div className="mt-5 pt-4 border-t hairline">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="focus-ring w-full flex items-center justify-between text-xs font-mono cursor-pointer"
          style={{ color: 'var(--ink)' }}
        >
          <span>{expanded ? 'Ocultar explicación profunda' : 'Ver lógica institucional y reglas'}</span>
          <ChevronDown
            size={15}
            className="transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--muted)' }}
          />
        </button>

        {expanded && (
          <div className="mt-4 space-y-3.5 text-sm">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                ¿Por qué ocurre institucionalmente?
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
                {concept.whyItHappens}
              </p>
            </div>

            <ul className="space-y-1.5">
              {concept.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 leading-relaxed" style={{ color: 'var(--ink)' }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--ink)' }} />
                  <span className="text-xs sm:text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {concept.mistake && (
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border hairline text-xs"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
              >
                <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--ink)' }} />
                <span>
                  <strong style={{ color: 'var(--ink)' }}>Error común: </strong>
                  {concept.mistake}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
