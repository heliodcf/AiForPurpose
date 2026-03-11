import React, { useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AgentWidget } from '../components/AgentWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { openAgent } = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const heroH = rect.height;
        // progress 0→1 as hero scrolls out of view
        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(1, Math.max(0, scrolled / heroH));

        if (video.duration && isFinite(video.duration)) {
          video.currentTime = progress * video.duration;
        }
        ticking = false;
      });
    };

    // Ensure video is ready for scrubbing
    video.pause();
    video.currentTime = 0;

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout>

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} className="relative min-h-screen bg-zinc-950 flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-orb pointer-events-none animate-glow-pulse" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-3 mb-10 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-blink flex-shrink-0" />
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-[0.25em]">
                  {t('hero2.badge')}
                </span>
              </div>

              <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight text-white mb-8 animate-fade-up stagger-1">
                {t('hero2.title1')}<br />
                <span className="text-brand-300">{t('hero2.title2')}</span>
              </h1>

              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg mb-10 animate-fade-up stagger-2">
                {t('hero2.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-3">
                <button
                  onClick={() => openAgent()}
                  className="px-8 py-4 bg-brand-300 text-zinc-950 font-display font-bold text-base hover:bg-brand-200 active:bg-brand-400 transition-colors rounded-lg"
                >
                  {t('hero2.cta1')} →
                </button>
                <button
                  onClick={() => document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-zinc-700 text-zinc-300 font-medium text-base hover:border-brand-300 hover:text-brand-300 transition-colors rounded-lg"
                >
                  {t('hero2.cta2')} ↓
                </button>
              </div>

              <p className="mt-6 font-mono text-xs text-zinc-600 animate-fade-up stagger-4">
                {t('hero2.hint')}
              </p>
            </div>

            {/* Right: Aria scroll-scrub video */}
            <div className="hidden lg:flex items-center justify-center relative animate-fade-in stagger-3">
              <div className="relative w-[420px] h-[420px]">
                <div className="absolute inset-0 rounded-full border border-zinc-800/50 animate-glow-pulse" />
                <video
                  ref={videoRef}
                  src={`${import.meta.env.BASE_URL}hero-aria.mp4`}
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════ TRUST BAR ══════ */}
      <div className="border-y border-zinc-800 bg-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-6">
            {t('trust.title')}
          </p>
          <div className="flex items-center justify-center gap-12 md:gap-16 opacity-50 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-400">RC</span>
              </div>
              <span className="font-display text-sm font-semibold text-zinc-400">Dr. Raphael Cunha</span>
            </div>
            <div className="hidden md:flex items-center gap-2 grayscale">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-xs text-zinc-500">●</span>
              </div>
              <span className="font-display text-sm text-zinc-600">{t('trust.confidential')}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 grayscale">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-xs text-zinc-500">●</span>
              </div>
              <span className="font-display text-sm text-zinc-600">{t('trust.confidential')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ THE PROBLEM ══════ */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] block mb-5">
              — {t('prob.label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              {t('prob.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('prob.card1.title'), stat: t('prob.card1.stat'), desc: t('prob.card1.desc'), icon: <ClockIcon /> },
              { title: t('prob.card2.title'), stat: t('prob.card2.stat'), desc: t('prob.card2.desc'), icon: <UsersIcon /> },
              { title: t('prob.card3.title'), stat: t('prob.card3.stat'), desc: t('prob.card3.desc'), icon: <CostIcon /> },
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 card-glow">
                <div className="w-10 h-10 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-4">{card.title}</h3>
                <div className="font-display text-4xl font-bold text-brand-300 mb-2">{card.stat}</div>
                <p className="text-zinc-500 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-400 text-lg mt-16 font-display">
            {t('prob.transition')}
          </p>
        </div>
      </section>

      {/* ══════ SOLUTION ══════ */}
      <section className="py-32 bg-zinc-950" id="solucoes">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] block mb-5">
              — {t('sol.label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              {t('sol.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ChatIcon />,
                title: t('sol.card1.title'),
                desc: t('sol.card1.desc'),
                tags: [t('sol.card1.t1'), t('sol.card1.t2'), t('sol.card1.t3'), t('sol.card1.t4')],
              },
              {
                icon: <PhoneIcon />,
                title: t('sol.card2.title'),
                desc: t('sol.card2.desc'),
                tags: [t('sol.card2.t1'), t('sol.card2.t2'), t('sol.card2.t3')],
              },
              {
                icon: <TrendIcon />,
                title: t('sol.card3.title'),
                desc: t('sol.card3.desc'),
                tags: [t('sol.card3.t1'), t('sol.card3.t2'), t('sol.card3.t3')],
              },
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-10 lg:p-12 card-glow group">
                <div className="w-12 h-12 border border-zinc-700 group-hover:border-brand-300/50 rounded-xl flex items-center justify-center mb-8 transition-colors">
                  {card.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-brand-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">{card.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full text-zinc-400 text-xs font-mono group-hover:border-zinc-600 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CASE STUDY ══════ */}
      <section className="py-32 bg-zinc-900/50 border-y border-zinc-800" id="casos">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] block mb-5">
              — {t('case.label')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Testimonial */}
            <div>
              <div className="relative">
                <span className="quote-mark absolute -top-8 -left-4">"</span>
                <blockquote className="relative z-10 text-xl lg:text-2xl text-zinc-300 italic leading-relaxed font-display pl-2">
                  {t('case.testimonial')}
                </blockquote>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-300/10 border border-brand-300/20 flex items-center justify-center">
                  <span className="font-display font-bold text-brand-300 text-lg">RC</span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg">{t('case.name')}</div>
                  <div className="text-zinc-500 text-sm">{t('case.role')} — {t('case.company')}</div>
                </div>
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { value: t('case.metric1.value'), label: t('case.metric1.label') },
                { value: t('case.metric2.value'), label: t('case.metric2.label') },
                { value: t('case.metric3.value'), label: t('case.metric3.label') },
              ].map((metric, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between card-glow">
                  <span className="text-zinc-400 text-sm font-medium">{metric.label}</span>
                  <span className="font-display text-3xl font-bold text-brand-300">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-32 bg-zinc-950" id="como-funciona">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] block mb-5">
              — {t('hiw2.label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white max-w-2xl leading-tight">
              {t('hiw2.title')}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              { num: '01', title: t('hiw2.s1.title'), desc: t('hiw2.s1.desc') },
              { num: '02', title: t('hiw2.s2.title'), desc: t('hiw2.s2.desc') },
              { num: '03', title: t('hiw2.s3.title'), desc: t('hiw2.s3.desc') },
            ].map((step, i) => (
              <div key={i} className="relative pl-12 pb-16 last:pb-0 group">
                {i < 2 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
                )}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-700 group-hover:border-brand-300 transition-colors timeline-dot flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-brand-300 transition-colors" />
                </div>
                <div>
                  <span className="font-mono text-xs text-brand-300 uppercase tracking-wider">{step.num}</span>
                  <h4 className="font-display text-2xl font-bold text-white mt-2 mb-3 group-hover:text-brand-300 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-zinc-500 text-base leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PRICING ══════ */}
      <section className="py-32 bg-zinc-900/30 border-t border-zinc-800" id="planos">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] block mb-5">— {t('nav.pricing')}</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white max-w-xl leading-tight">
                {t('prc.title')}
              </h2>
            </div>
            <p className="mt-6 lg:mt-0 text-zinc-500 max-w-xs lg:text-right text-sm leading-relaxed">
              {t('prc.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 card-glow">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-6">{t('prc.st.title')}</span>
              <div className="font-display text-3xl font-bold text-white mb-2">{t('prc.ent.custom')}</div>
              <p className="text-zinc-500 text-sm mb-8">{t('prc.st.desc')}</p>
              <ul className="space-y-3 mb-10">
                {[t('prc.st.f1'), t('prc.st.f2'), t('prc.st.f3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                    <span className="text-zinc-600 mt-0.5">—</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-brand-300 hover:text-brand-300 transition-colors rounded-xl">
                {t('prc.st.btn')}
              </button>
            </div>

            {/* Growth (highlighted) */}
            <div className="relative bg-zinc-950 border-2 border-brand-300/30 rounded-2xl p-10 shadow-lg shadow-brand-300/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="font-mono text-xs text-zinc-950 bg-brand-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {t('prc.gr.badge')}
                </span>
              </div>
              <span className="font-mono text-xs text-brand-300 uppercase tracking-widest block mb-6">{t('prc.gr.title')}</span>
              <div className="font-display text-3xl font-bold text-white mb-2">{t('prc.ent.custom')}</div>
              <p className="text-zinc-400 text-sm mb-8">{t('prc.gr.desc')}</p>
              <ul className="space-y-3 mb-10">
                {[t('prc.gr.f1'), t('prc.gr.f2'), t('prc.gr.f3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <span className="text-brand-300 mt-0.5">—</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 bg-brand-300 text-zinc-950 font-display font-bold text-sm hover:bg-brand-200 transition-colors rounded-xl">
                {t('prc.gr.btn')}
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 card-glow">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-6">{t('prc.ent.title')}</span>
              <div className="font-display text-3xl font-bold text-white mb-2">{t('prc.ent.custom')}</div>
              <p className="text-zinc-500 text-sm mb-8">{t('prc.ent.desc')}</p>
              <ul className="space-y-3 mb-10">
                {[t('prc.ent.f1'), t('prc.ent.f2'), t('prc.ent.f3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                    <span className="text-zinc-600 mt-0.5">—</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-brand-300 hover:text-brand-300 transition-colors rounded-xl">
                {t('prc.ent.btn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA FINAL ══════ */}
      <section className="relative py-40 bg-zinc-950 overflow-hidden border-t border-zinc-800">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] glow-orb pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[0.92] tracking-tight mb-8">
            {t('cta2.title')}
          </h2>
          <p className="text-zinc-400 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            {t('cta2.subtitle')}
          </p>
          <button
            onClick={() => openAgent()}
            className="inline-flex items-center gap-3 px-12 py-5 bg-brand-300 text-zinc-950 font-display font-bold text-xl hover:bg-brand-200 active:bg-brand-400 transition-colors rounded-xl"
          >
            {t('cta2.btn')} <span>→</span>
          </button>
        </div>
      </section>

      <AgentWidget />
    </Layout>
  );
};

/* ─── Sub-components ──────────────────────────────────────────────────── */

const ChatIcon = () => (
  <svg className="w-5 h-5 text-zinc-500 group-hover:text-brand-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-zinc-500 group-hover:text-brand-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const TrendIcon = () => (
  <svg className="w-5 h-5 text-zinc-500 group-hover:text-brand-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CostIcon = () => (
  <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
