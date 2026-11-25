import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronsDown, ArrowUpRight, RotateCcw } from 'lucide-react';
import { MODULES } from './data/curriculum';
import { Navbar } from './components/Navbar';
import { ConceptCard } from './components/ConceptCard';
import { HeroChartLab } from './components/labs/HeroChartLab';
import { SmcStructureLab } from './components/labs/SmcStructureLab';
import { LiquidityPoiLab } from './components/labs/LiquidityPoiLab';
import { WyckoffCycleLab } from './components/labs/WyckoffCycleLab';
import { ConfluenceEngineLab } from './components/labs/ConfluenceEngineLab';
import { QuizSection } from './components/QuizSection';
import { GlossarySection } from './components/GlossarySection';
import type { ModuleId } from './types/curriculum';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STORAGE_KEY_PROGRESS = 'iluminado-completed-lessons-v1';
const STORAGE_KEY_THEME = 'iluminado-theme-v1';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(completedIds));
  }, [completedIds]);

  const totalConcepts = MODULES.reduce((acc, m) => acc + m.concepts.length, 0);

  const toggleConcept = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero sculptural editorial entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.6 })
          .from('.hero-headline-line', { opacity: 0, y: 36, duration: 0.85, stagger: 0.1 }, '-=0.35')
          .from('.hero-copy', { opacity: 0, y: 18, duration: 0.65 }, '-=0.45')
          .from('.hero-cta', { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, '-=0.35')
          .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.1');

        // 2. Top scroll progress bar
        gsap.to('.scroll-progress-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });

        // 3. Portfolio-style scroll hint fade on scroll
        gsap.to('.scroll-hint', {
          opacity: 0,
          y: 12,
          scrollTrigger: {
            trigger: '#top',
            start: 'top top',
            end: '+=160',
            scrub: true,
          },
        });

        // 4. Module section headers reveal
        gsap.utils.toArray<HTMLElement>('.module-header').forEach((header) => {
          gsap.from(header, {
            opacity: 0,
            y: 28,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 84%',
              once: true,
            },
          });
        });

        // 5. Batched Concept Cards entrance
        ScrollTrigger.batch('.concept-card', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              opacity: 0,
              y: 24,
              duration: 0.65,
              stagger: 0.09,
              ease: 'power3.out',
              overwrite: true,
            });
          },
        });
      });
    },
    { scope: rootRef }
  );

  const renderLab = (id: ModuleId) => {
    switch (id) {
      case 'smc':
        return <SmcStructureLab />;
      case 'liquidity':
        return <LiquidityPoiLab />;
      case 'wyckoff':
        return <WyckoffCycleLab />;
      case 'engine':
        return <ConfluenceEngineLab />;
    }
  };

  return (
    <div ref={rootRef} id="top" className="min-h-screen transition-colors">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        completedCount={completedIds.length}
        totalCount={totalConcepts}
      />

      {/* HERO — Sculptural Soria Editorial + Live Animated Chart */}
      <section className="relative min-h-screen pt-28 pb-20 flex flex-col justify-between">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="hero-eyebrow inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--muted)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                <span>Academia Interactiva · Pine Script v6</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl xl:text-[68px] leading-[0.98] tracking-tight">
                <span className="hero-headline-line block">Lee el mercado</span>
                <span className="hero-headline-line block">como las</span>
                <span className="hero-headline-line block" style={{ color: 'var(--muted)' }}>
                  instituciones.
                </span>
              </h1>

              <p className="hero-copy text-sm sm:text-base leading-relaxed mt-6 max-w-md" style={{ color: 'var(--muted)' }}>
                Domina paso a paso todos los conceptos detrás del{' '}
                <strong style={{ color: 'var(--ink)' }}>SMC + Wyckoff Institutional Engine</strong>: estructura fractal,
                liquidez, cajas grises de imbalance, fases A–E, confluencia 0–100 y Modo Sombra.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#smc"
                  className="hero-cta focus-ring px-5 py-2.5 rounded-full text-xs font-mono transition-opacity hover:opacity-85"
                  style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--pill-ink)' }}
                >
                  Comenzar Módulo 01
                </a>
                <a
                  href="#engine"
                  className="hero-cta focus-ring px-5 py-2.5 rounded-full text-xs font-mono border hairline transition-colors hover:opacity-80"
                  style={{ color: 'var(--ink)' }}
                >
                  Probar Simulador 0–100
                </a>
              </div>

              <div className="hero-cta mt-9 pt-6 border-t hairline grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <div className="text-lg font-display" style={{ color: 'var(--ink)' }}>04</div>
                  <div style={{ color: 'var(--muted)' }}>Módulos</div>
                </div>
                <div>
                  <div className="text-lg font-display" style={{ color: 'var(--ink)' }}>0–100</div>
                  <div style={{ color: 'var(--muted)' }}>Scoring Live</div>
                </div>
                <div>
                  <div className="text-lg font-display" style={{ color: 'var(--ink)' }}>0%</div>
                  <div style={{ color: 'var(--muted)' }}>Repintado</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <HeroChartLab />
            </div>
          </div>
        </div>

        {/* Portfolio-inspired Scroll Hint */}
        <div className="scroll-hint flex items-center justify-center gap-1.5 text-[11px] font-mono tracking-[0.22em] pt-8" style={{ color: 'var(--muted)' }}>
          <ChevronsDown size={14} className="animate-bounce" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* CURRICULUM MODULES (01 → 04) */}
      <main>
        {MODULES.map((mod) => {
          const doneInMod = mod.concepts.filter((c) => completedIds.includes(c.id)).length;
          return (
            <section key={mod.id} id={mod.id} className="py-24 sm:py-28 border-t hairline">
              <div className="max-w-6xl mx-auto px-5 sm:px-8">
                {/* Editorial Chapter Header */}
                <div className="module-header grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--accent)' }}>Módulo {mod.number}</span>
                      <span>·</span>
                      <span>
                        {doneInMod}/{mod.concepts.length} completados
                      </span>
                    </div>
                    <h2 className="font-display text-4xl sm:text-6xl leading-[1.02]">{mod.title}</h2>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink)' }}>
                      {mod.question}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {mod.intro}
                    </p>
                  </div>
                </div>

                {/* Interactive GSAP Visual Lab for this module */}
                <div className="mb-10">{renderLab(mod.id)}</div>

                {/* Deep Concept Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {mod.concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      completed={completedIds.includes(concept.id)}
                      onToggleComplete={toggleConcept}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* Knowledge Check & Searchable Glossary */}
        <QuizSection />
        <GlossarySection />
      </main>

      {/* FOOTER — Minimalist Portfolio-inspired Closing */}
      <footer className="py-14 border-t hairline">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-display text-2xl">SMC + Wyckoff Institutional Engine</div>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>
              Documentación interactiva educativa · Pine Script v6 · Inspirado en Portfolio de Imanol Valenzuela
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {completedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompletedIds([])}
                className="focus-ring inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                style={{ color: 'var(--muted)' }}
              >
                <RotateCcw size={12} />
                <span>Reiniciar progreso</span>
              </button>
            )}
            <a
              href="https://github.com/ImaaValenzuela/indicador-iluminado"
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1 px-4 py-2 rounded-full border hairline hover:opacity-80"
              style={{ color: 'var(--ink)' }}
            >
              <span>Ver Repositorio GitHub</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
