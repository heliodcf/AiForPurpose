import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const { navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const openQuote = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('#/');
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-agent')), 100);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-950">

      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80'
            : 'bg-transparent border-b border-zinc-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-4">

            {/* Logo */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-xl text-brand-300 tracking-tight leading-none">AI</span>
                <span className="font-display font-bold text-xl text-white tracking-tight leading-none">For Purpose</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-blink ml-1" />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: t('nav.solutions'), id: 'solucoes' },
                { label: t('nav.cases'), id: 'casos' },
                { label: t('nav.pricing'), id: 'planos' },
                { label: t('nav.howItWorks'), id: 'como-funciona' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-zinc-400 hover:text-white font-medium text-sm transition-colors tracking-wide"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-5">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
                className="bg-transparent text-xs font-mono font-bold text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer transition-colors uppercase tracking-wider"
              >
                <option value="en" className="bg-zinc-900">EN</option>
                <option value="pt" className="bg-zinc-900">PT</option>
                <option value="es" className="bg-zinc-900">ES</option>
              </select>

              <button
                onClick={() => navigate('#/admin')}
                className="text-zinc-400 hover:text-white font-medium text-sm transition-colors tracking-wide"
              >
                Dashboard
              </button>

              <button
                onClick={openQuote}
                className="px-5 py-2.5 bg-brand-300 text-zinc-950 font-display font-bold text-sm hover:bg-brand-200 transition-colors tracking-wide"
              >
                {t('nav.talkToAria')} →
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
                className="bg-transparent text-xs font-mono font-bold text-zinc-500 focus:outline-none cursor-pointer uppercase"
              >
                <option value="en" className="bg-zinc-900">EN</option>
                <option value="pt" className="bg-zinc-900">PT</option>
                <option value="es" className="bg-zinc-900">ES</option>
              </select>
              <button
                onClick={() => navigate('#/admin')}
                className="text-zinc-400 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                Dash
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
            <div className="px-6 py-6 flex flex-col gap-5">
              {[
                { label: t('nav.solutions'), id: 'solucoes' },
                { label: t('nav.cases'), id: 'casos' },
                { label: t('nav.pricing'), id: 'planos' },
                { label: t('nav.howItWorks'), id: 'como-funciona' },
              ].map(({ label, id }) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-left text-zinc-300 font-medium text-base">
                  {label}
                </button>
              ))}
              <button
                onClick={openQuote}
                className="mt-2 px-6 py-3 bg-brand-300 text-zinc-950 font-display font-bold text-sm text-left"
              >
                {t('nav.talkToAria')} →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">

            {/* Brand col */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-display font-bold text-2xl text-brand-300 tracking-tight">AI</span>
                <span className="font-display font-bold text-2xl text-white tracking-tight">For Purpose</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-8">
                {t('ft.desc')}
              </p>
              <div className="flex gap-4">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-brand-300 transition-colors">LinkedIn</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-brand-300 transition-colors">Instagram</a>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">{t('ft.prod')}</h4>
              <ul className="space-y-3">
                {[t('ft.prod.1'), t('ft.prod.2'), t('ft.prod.3'), t('ft.prod.4')].map((item, i) => (
                  <li key={i}>
                    <button onClick={() => document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-zinc-400 hover:text-brand-300 transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">{t('ft.comp')}</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-zinc-400 hover:text-brand-300 transition-colors">
                    {t('ft.comp.1')}
                  </a>
                </li>
                <li>
                  <button onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-zinc-400 hover:text-brand-300 transition-colors">
                    {t('ft.comp.2')}
                  </button>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-zinc-400 hover:text-brand-300 transition-colors">
                    {t('ft.comp.3')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-zinc-400 hover:text-brand-300 transition-colors">
                    {t('ft.comp.4')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
              © {new Date().getFullYear()} AI For Purpose. {t('ft.rights')}
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-pulse-slow" />
              <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">{t('ft.systems')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
