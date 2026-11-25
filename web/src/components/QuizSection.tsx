import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculum';

gsap.registerPlugin(useGSAP);

export function QuizSection() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  const scopeRef = useRef<HTMLDivElement>(null);
  const q = QUIZ_QUESTIONS[index];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.quiz-stage', { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' });
      });
    },
    { scope: scopeRef, dependencies: [index, finished], revertOnUpdate: true }
  );

  const choose = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === q.correctIndex) {
      setCorrectTotal((prev) => prev + 1);
    }
  };

  const next = () => {
    if (index + 1 < QUIZ_QUESTIONS.length) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setCorrectTotal(0);
    setFinished(false);
  };

  return (
    <section id="quiz" ref={scopeRef} className="py-24 sm:py-28 border-t hairline">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Evaluación Práctica
            </span>
            <h2 className="font-display text-4xl sm:text-5xl mt-1">Comprobá tu Lectura Institucional</h2>
          </div>
          <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--muted)' }}>
            {finished
              ? `Resultado: ${correctTotal} / ${QUIZ_QUESTIONS.length}`
              : `Pregunta ${index + 1} de ${QUIZ_QUESTIONS.length}`}
          </span>
        </div>

        <div className="quiz-stage surface-card rounded-2xl p-6 sm:p-8">
          {finished ? (
            <div className="text-center py-6">
              <div className="font-display text-6xl tabular-nums">
                {correctTotal}/{QUIZ_QUESTIONS.length}
              </div>
              <p className="text-sm sm:text-base mt-3 max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
                {correctTotal === QUIZ_QUESTIONS.length
                  ? 'Dominio completo: comprendés cada regla del motor SMC, Liquidez, Wyckoff y Modo Sombra.'
                  : correctTotal >= 4
                    ? 'Muy sólida comprensión institucional. Repasá los detalles que fallaste antes de calibrar alertas.'
                    : 'Buen primer intento. Recorré los laboratorios interactivos arriba y volvé a probar.'}
              </p>
              <button
                type="button"
                onClick={restart}
                className="focus-ring mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono cursor-pointer transition-opacity hover:opacity-85"
                style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--pill-ink)' }}
              >
                <RotateCcw size={13} />
                <span>Reintentar Evaluación</span>
              </button>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                {q.module}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl leading-snug">{q.prompt}</h3>

              <div className="mt-6 space-y-2.5">
                {q.options.map((opt, i) => {
                  const isChosen = selected === i;
                  const isCorrect = i === q.correctIndex;
                  const reveal = selected !== null;

                  let borderCol = 'var(--border)';
                  let bgCol = 'var(--bg)';
                  if (reveal && isCorrect) {
                    borderCol = 'var(--ink)';
                    bgCol = 'var(--accent-soft)';
                  } else if (reveal && isChosen && !isCorrect) {
                    borderCol = 'var(--subtle)';
                    bgCol = 'var(--surface-strong)';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={reveal}
                      onClick={() => choose(i)}
                      className="focus-ring w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default"
                      style={{ borderColor: borderCol, backgroundColor: bgCol, color: 'var(--ink)' }}
                    >
                      <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: 'var(--muted)' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-6 pt-5 border-t hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--ink)' }}>
                      {selected === q.correctIndex ? 'Correcto — ' : 'A revisar — '}
                    </strong>
                    {q.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={next}
                    className="focus-ring inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-mono shrink-0 cursor-pointer"
                    style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--pill-ink)' }}
                  >
                    <span>{index + 1 < QUIZ_QUESTIONS.length ? 'Siguiente' : 'Ver resultado'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
