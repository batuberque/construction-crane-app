import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { NAV_LINKS, SITE } from '../../lib/site';
import { pageImports } from '../AnimatedRouter';
import { fetchProjects } from '../../services/queries';
import logo from '../../assets/logo.webp';

const linkBase =
  'spec relative py-2 transition-colors hover:text-signal text-concrete';
const activeBar =
  'after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-hazard';

const NavBar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close on route change.
  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  // One effect keyed on the open state — the previous version added and removed
  // this listener imperatively against stale state and leaked it on every route
  // change while the menu was open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen, handleClickOutside]);

  /** Warm the route chunk (and the project list) before the click lands. */
  const prefetch = (to: string) => {
    void pageImports[to as keyof typeof pageImports]?.();
    if (to === '/project') void queryClient.prefetchQuery(['projects'], fetchProjects);
  };

  return (
    <header
      ref={navRef}
      data-surface="graphite"
      className="fixed top-0 inset-x-0 z-50 border-b border-steel-line"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-nav items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            aria-label={`${SITE.name} — ana sayfa`}
          >
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-semibold tracking-tight leading-none text-signal">
              <span className="text-base sm:text-lg">TORA</span>
              <span className="hidden sm:inline text-base sm:text-lg text-concrete font-normal">
                {' '}
                VİNÇ &amp; İNŞAAT
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Ana menü">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onMouseEnter={() => prefetch(to)}
                onFocus={() => prefetch(to)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? `text-signal ${activeBar}` : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              className="hidden sm:inline-flex items-center gap-2 bg-hazard px-4 py-2 spec text-graphite font-medium hover:bg-hazard/90 transition-colors"
            >
              {SITE.phone}
            </a>

            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              className="lg:hidden p-2 -mr-2 text-signal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {isMenuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.75" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!isMenuOpen}
        className="lg:hidden border-t border-steel-line bg-graphite"
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-2" aria-label="Mobil menü">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onTouchStart={() => prefetch(to)}
              className={({ isActive }) =>
                `spec block py-3 border-b border-steel-line last:border-0 ${
                  isActive ? 'text-hazard' : 'text-concrete'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            className="spec block py-3 text-hazard sm:hidden"
          >
            {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
