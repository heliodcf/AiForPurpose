import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const { navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">AI</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">For Purpose</span>
              </a>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#solucoes" onClick={(e) => { e.preventDefault(); document.getElementById('solucoes')?.scrollIntoView({behavior: 'smooth'}); }} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">{t('nav.solutions')}</a>
              <a href="#como-funciona" onClick={(e) => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({behavior: 'smooth'}); }} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">{t('nav.howItWorks')}</a>
              <a href="#casos" onClick={(e) => { e.preventDefault(); document.getElementById('casos')?.scrollIntoView({behavior: 'smooth'}); }} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">{t('nav.cases')}</a>
              <a href="#planos" onClick={(e) => { e.preventDefault(); document.getElementById('planos')?.scrollIntoView({behavior: 'smooth'}); }} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">{t('nav.pricing')}</a>
            </nav>

            {/* CTA, Login & Language Switcher */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center border-r border-slate-200 pr-4">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')} 
                  className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                  <option value="es">ES</option>
                </select>
              </div>
              <a 
                href="#/admin" 
                onClick={(e) => { e.preventDefault(); navigate('#/admin'); }} 
                className="text-slate-500 hover:text-slate-900 font-medium text-sm"
              >
                {t('nav.dashboard')}
              </a>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate('#/');
                  setTimeout(() => {
                    const event = new CustomEvent('open-agent');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow"
              >
                {t('nav.getQuote')}
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
               <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')} 
                  className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                  <option value="es">ES</option>
                </select>
              <button 
                className="text-slate-600 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full">
            <a 
              href="#solucoes" 
              onClick={(e) => { 
                e.preventDefault(); 
                document.getElementById('solucoes')?.scrollIntoView({behavior: 'smooth'}); 
                setIsMobileMenuOpen(false);
              }} 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
            >
              {t('nav.solutions')}
            </a>
            <a 
              href="#como-funciona" 
              onClick={(e) => { 
                e.preventDefault(); 
                document.getElementById('como-funciona')?.scrollIntoView({behavior: 'smooth'}); 
                setIsMobileMenuOpen(false);
              }} 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
            >
              {t('nav.howItWorks')}
            </a>
            <a 
              href="#casos" 
              onClick={(e) => { 
                e.preventDefault(); 
                document.getElementById('casos')?.scrollIntoView({behavior: 'smooth'}); 
                setIsMobileMenuOpen(false);
              }} 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
            >
              {t('nav.cases')}
            </a>
            <a 
              href="#planos" 
              onClick={(e) => { 
                e.preventDefault(); 
                document.getElementById('planos')?.scrollIntoView({behavior: 'smooth'}); 
                setIsMobileMenuOpen(false);
              }} 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
            >
              {t('nav.pricing')}
            </a>
            <div className="pt-4 pb-2 border-t border-slate-100 mt-2">
              <a 
                href="#/admin" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigate('#/admin'); 
                  setIsMobileMenuOpen(false);
                }} 
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              >
                {t('nav.dashboard')}
              </a>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate('#/');
                  setTimeout(() => {
                    const event = new CustomEvent('open-agent');
                    window.dispatchEvent(event);
                  }, 100);
                  setIsMobileMenuOpen(false);
                }}
                className="mt-2 w-full text-center bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl font-medium text-base transition-all shadow-sm"
              >
                {t('nav.getQuote')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">AI</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">For Purpose</span>
              </div>
            <p className="text-sm max-w-sm mb-6">
              {t('ft.desc')}
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('ft.prod')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.prod.1')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.prod.2')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.prod.3')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.prod.4')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('ft.comp')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.comp.1')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.comp.2')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.comp.3')}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-400 transition-colors">{t('ft.comp.4')}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} AI For Purpose. {t('ft.rights')}</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t('ft.systems')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
