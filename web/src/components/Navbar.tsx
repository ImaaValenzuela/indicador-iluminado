import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  completedCount: number;
  totalCount: number;
}

const NAV_LINKS = [
  { href: '#smc', label: '01 Estructura' },
  { href: '#liquidity', label: '02 Liquidez' },
  { href: '#wyckoff', label: '03 Wyckoff' },
  { href: '#engine', label: '04 Motor' },
  { href: '#quiz', label: 'Quiz' },
  { href: '#glossary', label: 'Glosario' },
];

export function Navbar({ theme, onToggleTheme, completedCount, totalCount }: NavbarProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b hairline backdrop-blur-md transition-colors"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 86%, transparent)' }}
    >
      {/* Top GSAP-driven scroll hairline */}
      <div
        className="scroll-progress-bar absolute top-0 left-0 h-[2px] w-full origin-left scale-x-0"
        style={{ backgroundColor: 'var(--accent)' }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="focus-ring flex items-center gap-2.5 shrink-0">
          <span className="font-display text-xl tracking-wide" style={{ color: 'var(--ink)' }}>
            Iluminado
          </span>
          <span
            className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border hairline"
            style={{ color: 'var(--muted)' }}
          >
            SMC · Wyckoff
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-5" aria-label="Módulos del curso">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring text-xs font-mono transition-opacity hover:opacity-100 opacity-70"
              style={{ color: 'var(--ink)' }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tabular-nums" style={{ color: 'var(--muted)' }}>
            <span>
              {completedCount}/{totalCount}
            </span>
            <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
            className="focus-ring w-8 h-8 rounded-full border hairline flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)' }}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
