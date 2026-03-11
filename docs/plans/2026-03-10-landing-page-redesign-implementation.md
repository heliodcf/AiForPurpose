# Landing Page Redesign — "Storytelling Cinematico" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the AiForPurpose landing page with a storytelling-driven layout (problem > solution > proof > action) for conversion + premium branding.

**Architecture:** Rewrite `pages/Landing.tsx` with 9 sections following the approved design doc. Update `components/Layout.tsx` (header/footer), add new i18n keys to `i18n/translations.ts`, and add CSS animations to `index.html`. No new dependencies — pure React + Tailwind CSS via CDN.

**Tech Stack:** React 19, TypeScript, Tailwind CSS (CDN v3), Vite, custom i18n system.

---

## Task 1: Add new i18n translation keys

**Files:**
- Modify: `AiForPurpose/i18n/translations.ts`

**Step 1: Add new keys to all 3 language blocks (en, pt, es)**

Add these keys to each language block. Place them after the existing `cta.hint` key and before the `currency.symbol` key.

**English (en) — add after line 136:**

```typescript
    // New: Header CTA
    'nav.talkToAria': 'Talk to Aria',
    'nav.cases': 'Cases',

    // New: Hero redesign
    'hero2.badge': 'AI agents that work for you — 24/7',
    'hero2.title1': 'Stop losing clients.',
    'hero2.title2': 'Start scaling.',
    'hero2.subtitle': 'Smart automation that answers, qualifies, and converts — while you focus on what matters.',
    'hero2.cta1': 'Talk to Aria',
    'hero2.cta2': 'See Cases',
    'hero2.hint': 'No commitment. Response in seconds.',

    // New: Trust Bar
    'trust.title': 'Companies using our agents',
    'trust.confidential': 'Confidential Client',

    // New: Problem section
    'prob.label': 'The problem',
    'prob.title': 'Is your team still answering manually?',
    'prob.card1.title': 'Lost leads outside business hours',
    'prob.card1.stat': '67%',
    'prob.card1.desc': 'of leads come in outside business hours',
    'prob.card2.title': 'Overwhelmed team with repetitive tasks',
    'prob.card2.stat': '4h/day',
    'prob.card2.desc': 'spent on repeated questions',
    'prob.card3.title': 'High cost to scale support',
    'prob.card3.stat': '$5k+/mo',
    'prob.card3.desc': 'per person to hire + train',
    'prob.transition': 'What if you could solve all of this with AI?',

    // New: Solution section
    'sol.label': 'Our Agents',
    'sol.title': 'Smart support across all channels',
    'sol.card1.title': 'Messaging Agents',
    'sol.card1.desc': 'Serve via WhatsApp, Instagram, Telegram, and Web with agents that understand context and close deals in chat.',
    'sol.card1.t1': 'WhatsApp',
    'sol.card1.t2': 'Instagram',
    'sol.card1.t3': 'Telegram',
    'sol.card1.t4': 'Web Widget',
    'sol.card2.title': 'Voice Agent (Smart IVR)',
    'sol.card2.desc': 'Forget "press 1 for sales". Our voice agents converse naturally, solve problems, and transfer only when needed.',
    'sol.card2.t1': 'Natural Language',
    'sol.card2.t2': 'CRM Sync',
    'sol.card2.t3': 'Auto Transcription',
    'sol.card3.title': 'Automatic Conversion',
    'sol.card3.desc': 'Qualification, follow-up, and nurturing — all automated. Your pipeline never stops.',
    'sol.card3.t1': 'Lead Scoring',
    'sol.card3.t2': 'Auto Follow-up',
    'sol.card3.t3': 'CRM Integration',

    // New: Case study
    'case.label': 'Real Case',
    'case.name': 'Dr. Raphael Cunha',
    'case.role': 'Director',
    'case.company': 'Medical Clinic',
    'case.testimonial': '"The virtual secretary transformed our clinic. We now serve patients 24/7 and our team focuses on what really matters — patient care."',
    'case.metric1.value': '24/7',
    'case.metric1.label': 'Automated support',
    'case.metric2.value': '70%',
    'case.metric2.label': 'Less manual work',
    'case.metric3.value': '<2s',
    'case.metric3.label': 'Response time',

    // New: How it works redesign
    'hiw2.label': 'How it works',
    'hiw2.title': 'From briefing to results in days',
    'hiw2.s1.title': 'Briefing in 5 minutes',
    'hiw2.s1.desc': 'Talk to Aria, our AI. She understands your business and maps what to automate.',
    'hiw2.s2.title': 'Custom implementation',
    'hiw2.s2.desc': 'We configure agents on the right channels, integrated with your CRM and systems.',
    'hiw2.s3.title': 'Automatic scaling',
    'hiw2.s3.desc': 'Your agents work 24/7. You track everything on the real-time dashboard.',

    // New: CTA redesign
    'cta2.title': 'Ready to scale your support?',
    'cta2.subtitle': 'Talk to Aria now. No commitment. Results in days, not months.',
    'cta2.btn': 'Start Now',
```

**Portuguese (pt) — add after line 275:**

```typescript
    // New: Header CTA
    'nav.talkToAria': 'Fale com a Aria',

    // New: Hero redesign
    'hero2.badge': 'Agentes de IA que trabalham por voce — 24/7',
    'hero2.title1': 'Pare de perder clientes.',
    'hero2.title2': 'Comece a escalar.',
    'hero2.subtitle': 'Automacao inteligente que atende, qualifica e converte — enquanto voce foca no que importa.',
    'hero2.cta1': 'Fale com a Aria',
    'hero2.cta2': 'Ver Cases',
    'hero2.hint': 'Sem compromisso. Resposta em segundos.',

    // New: Trust Bar
    'trust.title': 'Empresas usando nossos agentes',
    'trust.confidential': 'Cliente Confidencial',

    // New: Problem section
    'prob.label': 'O problema',
    'prob.title': 'Sua equipe ainda atende manualmente?',
    'prob.card1.title': 'Leads perdidos fora do horario',
    'prob.card1.stat': '67%',
    'prob.card1.desc': 'dos leads entram fora do expediente',
    'prob.card2.title': 'Equipe sobrecarregada',
    'prob.card2.stat': '4h/dia',
    'prob.card2.desc': 'gastas em perguntas repetidas',
    'prob.card3.title': 'Custo alto pra escalar',
    'prob.card3.stat': 'R$5k+/mes',
    'prob.card3.desc': 'por pessoa pra contratar + treinar',
    'prob.transition': 'E se voce pudesse resolver tudo isso com IA?',

    // New: Solution section
    'sol.label': 'Nossos Agentes',
    'sol.title': 'Atendimento inteligente em todos os canais',
    'sol.card1.title': 'Agentes de Mensagem',
    'sol.card1.desc': 'Atenda via WhatsApp, Instagram, Telegram e Web com agentes que entendem contexto e fecham negocios no chat.',
    'sol.card1.t1': 'WhatsApp',
    'sol.card1.t2': 'Instagram',
    'sol.card1.t3': 'Telegram',
    'sol.card1.t4': 'Web Widget',
    'sol.card2.title': 'Agente de Voz (URA IA)',
    'sol.card2.desc': 'Esqueca o "digite 1 pra vendas". Nossos agentes conversam naturalmente, resolvem problemas e transferem so quando precisa.',
    'sol.card2.t1': 'Linguagem Natural',
    'sol.card2.t2': 'Sync CRM',
    'sol.card2.t3': 'Transcricao Auto',
    'sol.card3.title': 'Conversao Automatica',
    'sol.card3.desc': 'Qualificacao, follow-up e nurturing — tudo automatizado. Seu pipeline nunca para.',
    'sol.card3.t1': 'Lead Scoring',
    'sol.card3.t2': 'Auto Follow-up',
    'sol.card3.t3': 'Integracao CRM',

    // New: Case study
    'case.label': 'Case Real',
    'case.name': 'Dr. Raphael Cunha',
    'case.role': 'Diretor',
    'case.company': 'Clinica Medica',
    'case.testimonial': '"A secretaria virtual transformou nossa clinica. Agora atendemos pacientes 24/7 e nossa equipe foca no que realmente importa — o cuidado com o paciente."',
    'case.metric1.value': '24/7',
    'case.metric1.label': 'Atendimento automatizado',
    'case.metric2.value': '70%',
    'case.metric2.label': 'Menos trabalho manual',
    'case.metric3.value': '<2s',
    'case.metric3.label': 'Tempo de resposta',

    // New: How it works redesign
    'hiw2.label': 'Como funciona',
    'hiw2.title': 'Do briefing ao resultado em dias',
    'hiw2.s1.title': 'Briefing em 5 minutos',
    'hiw2.s1.desc': 'Converse com a Aria, nossa IA. Ela entende seu negocio e mapeia o que automatizar.',
    'hiw2.s2.title': 'Implementacao sob medida',
    'hiw2.s2.desc': 'Configuramos os agentes nos canais certos, integrados ao seu CRM e sistemas.',
    'hiw2.s3.title': 'Escala automatica',
    'hiw2.s3.desc': 'Seus agentes trabalham 24/7. Voce acompanha tudo no dashboard em tempo real.',

    // New: CTA redesign
    'cta2.title': 'Pronto pra escalar seu atendimento?',
    'cta2.subtitle': 'Converse com a Aria agora. Sem compromisso. Resultado em dias, nao meses.',
    'cta2.btn': 'Comecar Agora',
```

**Spanish (es) — add after line 414:**

```typescript
    // New: Header CTA
    'nav.talkToAria': 'Habla con Aria',

    // New: Hero redesign
    'hero2.badge': 'Agentes de IA que trabajan por ti — 24/7',
    'hero2.title1': 'Deja de perder clientes.',
    'hero2.title2': 'Empieza a escalar.',
    'hero2.subtitle': 'Automatizacion inteligente que atiende, califica y convierte — mientras te enfocas en lo que importa.',
    'hero2.cta1': 'Habla con Aria',
    'hero2.cta2': 'Ver Casos',
    'hero2.hint': 'Sin compromiso. Respuesta en segundos.',

    // New: Trust Bar
    'trust.title': 'Empresas usando nuestros agentes',
    'trust.confidential': 'Cliente Confidencial',

    // New: Problem section
    'prob.label': 'El problema',
    'prob.title': 'Tu equipo aun atiende manualmente?',
    'prob.card1.title': 'Leads perdidos fuera del horario',
    'prob.card1.stat': '67%',
    'prob.card1.desc': 'de los leads llegan fuera del horario',
    'prob.card2.title': 'Equipo sobrecargado',
    'prob.card2.stat': '4h/dia',
    'prob.card2.desc': 'en preguntas repetidas',
    'prob.card3.title': 'Costo alto para escalar',
    'prob.card3.stat': '$5k+/mes',
    'prob.card3.desc': 'por persona para contratar + entrenar',
    'prob.transition': 'Y si pudieras resolver todo esto con IA?',

    // New: Solution section
    'sol.label': 'Nuestros Agentes',
    'sol.title': 'Atencion inteligente en todos los canales',
    'sol.card1.title': 'Agentes de Mensajeria',
    'sol.card1.desc': 'Atiende via WhatsApp, Instagram, Telegram y Web con agentes que entienden contexto y cierran negocios en el chat.',
    'sol.card1.t1': 'WhatsApp',
    'sol.card1.t2': 'Instagram',
    'sol.card1.t3': 'Telegram',
    'sol.card1.t4': 'Web Widget',
    'sol.card2.title': 'Agente de Voz (IVR IA)',
    'sol.card2.desc': 'Olvida el "presione 1 para ventas". Nuestros agentes conversan naturalmente, resuelven problemas y transfieren solo cuando es necesario.',
    'sol.card2.t1': 'Lenguaje Natural',
    'sol.card2.t2': 'Sync CRM',
    'sol.card2.t3': 'Transcripcion Auto',
    'sol.card3.title': 'Conversion Automatica',
    'sol.card3.desc': 'Calificacion, follow-up y nurturing — todo automatizado. Tu pipeline nunca para.',
    'sol.card3.t1': 'Lead Scoring',
    'sol.card3.t2': 'Auto Follow-up',
    'sol.card3.t3': 'Integracion CRM',

    // New: Case study
    'case.label': 'Caso Real',
    'case.name': 'Dr. Raphael Cunha',
    'case.role': 'Director',
    'case.company': 'Clinica Medica',
    'case.testimonial': '"La secretaria virtual transformo nuestra clinica. Ahora atendemos pacientes 24/7 y nuestro equipo se enfoca en lo que realmente importa — el cuidado del paciente."',
    'case.metric1.value': '24/7',
    'case.metric1.label': 'Atencion automatizada',
    'case.metric2.value': '70%',
    'case.metric2.label': 'Menos trabajo manual',
    'case.metric3.value': '<2s',
    'case.metric3.label': 'Tiempo de respuesta',

    // New: How it works redesign
    'hiw2.label': 'Como funciona',
    'hiw2.title': 'Del briefing al resultado en dias',
    'hiw2.s1.title': 'Briefing en 5 minutos',
    'hiw2.s1.desc': 'Habla con Aria, nuestra IA. Ella entiende tu negocio y mapea que automatizar.',
    'hiw2.s2.title': 'Implementacion a medida',
    'hiw2.s2.desc': 'Configuramos los agentes en los canales correctos, integrados a tu CRM y sistemas.',
    'hiw2.s3.title': 'Escala automatica',
    'hiw2.s3.desc': 'Tus agentes trabajan 24/7. Tu monitoreas todo en el dashboard en tiempo real.',

    // New: CTA redesign
    'cta2.title': 'Listo para escalar tu atencion?',
    'cta2.subtitle': 'Habla con Aria ahora. Sin compromiso. Resultado en dias, no meses.',
    'cta2.btn': 'Empezar Ahora',
```

**Step 2: Verify translations load**

Run: `cd AiForPurpose && npm run dev`
Expected: Dev server starts without TypeScript errors.

**Step 3: Commit**

```bash
git add AiForPurpose/i18n/translations.ts
git commit -m "feat(i18n): add translation keys for landing page redesign"
```

---

## Task 2: Add CSS animations to index.html

**Files:**
- Modify: `AiForPurpose/index.html`

**Step 1: Add new keyframes to the Tailwind config script (inside `tailwind.config.theme.extend.animation`)**

Add after the existing `'pulse-slow'` animation entry (line 53):

```javascript
              'glow-pulse': 'glowPulse 4s ease-in-out infinite',
              'float': 'float 6s ease-in-out infinite',
```

Add after the existing `blink` keyframes entry (line 71):

```javascript
              glowPulse: {
                '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                '50%': { opacity: '0.8', transform: 'scale(1.05)' },
              },
              float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
```

**Step 2: Add new CSS classes in the `<style>` block (after the `.clip-diagonal` class, before `</style>`)**

```css
      /* Glow orb for hero */
      .glow-orb {
        background: radial-gradient(circle, rgba(168, 255, 62, 0.15) 0%, rgba(168, 255, 62, 0.02) 50%, transparent 70%);
      }

      /* Card hover glow */
      .card-glow {
        transition: all 0.3s ease;
      }
      .card-glow:hover {
        box-shadow: 0 0 30px rgba(168, 255, 62, 0.08), 0 0 60px rgba(168, 255, 62, 0.04);
        border-color: rgba(168, 255, 62, 0.2);
      }

      /* Timeline connector */
      .timeline-dot {
        box-shadow: 0 0 0 4px rgba(24, 24, 27, 1), 0 0 0 6px rgba(168, 255, 62, 0.3);
      }

      /* Quote marks */
      .quote-mark {
        font-family: Georgia, serif;
        font-size: 6rem;
        line-height: 1;
        color: rgba(168, 255, 62, 0.15);
      }
```

**Step 3: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Page loads, no errors in console.

**Step 4: Commit**

```bash
git add AiForPurpose/index.html
git commit -m "feat(css): add glow, float, timeline animations for redesign"
```

---

## Task 3: Update Layout.tsx — Header nav + Footer

**Files:**
- Modify: `AiForPurpose/components/Layout.tsx`

**Step 1: Update the desktop nav items array (line 58-62)**

Replace the nav items to match the new section IDs and add "Cases":

```typescript
              {[
                { label: t('nav.solutions'), id: 'solucoes' },
                { label: t('nav.cases'), id: 'casos' },
                { label: t('nav.pricing'), id: 'planos' },
                { label: t('nav.howItWorks'), id: 'como-funciona' },
              ].map(({ label, id }) => (
```

**Step 2: Replace the CTA button text (line 93-98)**

Change the header CTA from `t('nav.getQuote')` to `t('nav.talkToAria')`:

```typescript
              <button
                onClick={openQuote}
                className="px-5 py-2.5 bg-brand-300 text-zinc-950 font-display font-bold text-sm hover:bg-brand-200 transition-colors tracking-wide"
              >
                {t('nav.talkToAria')} →
              </button>
```

**Step 3: Remove the Dashboard link from desktop nav (lines 85-91)**

Delete the `<a href="#/admin"...>` element from the desktop right section. The admin panel remains accessible via direct URL `/#/admin`.

**Step 4: Update mobile menu to match (lines 135-156)**

Update the mobile nav items array to match desktop and remove the Dashboard link:

```typescript
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
```

**Step 5: Clean up footer — remove dead # links**

In the footer, replace the `<a href="#" onClick={(e) => e.preventDefault()}>` links with actual scroll-to or just plain `<span>` elements. Keep the structure but make links non-deceptive:

- Product links: Make them scroll to `#solucoes`
- Company links: Keep "Cases de Sucesso" scrolling to `#casos`, rest as `<span>` (no href)
- Social links: Keep as placeholders with `<span>` until real URLs are provided

**Step 6: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Header shows new nav items, CTA says "Fale com a Aria", no Dashboard link visible, footer links don't have dead hrefs.

**Step 7: Commit**

```bash
git add AiForPurpose/components/Layout.tsx
git commit -m "feat(layout): update header nav, CTA, remove dashboard link, clean footer"
```

---

## Task 4: Rewrite Landing.tsx — Hero + Trust Bar

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Replace the entire Hero section (lines 59-164)**

Remove the old Hero (with metrics panel) and replace with the new clean hero:

```tsx
      {/* ══════ HERO ══════ */}
      <section className="relative min-h-screen bg-zinc-950 flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background effects */}
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

            {/* Right: Glow Orb visual */}
            <div className="hidden lg:flex items-center justify-center relative animate-fade-in stagger-3">
              <div className="relative w-80 h-80">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-zinc-800 animate-glow-pulse" />
                {/* Middle ring */}
                <div className="absolute inset-8 rounded-full border border-brand-300/10 animate-glow-pulse" style={{ animationDelay: '1s' }} />
                {/* Inner glow */}
                <div className="absolute inset-16 rounded-full bg-brand-300/10 blur-2xl animate-float" />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-brand-300 shadow-lg shadow-brand-300/50 animate-blink" />
                </div>
                {/* Floating particles */}
                <div className="absolute top-12 right-8 w-1.5 h-1.5 rounded-full bg-brand-300/40 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-16 left-12 w-1 h-1 rounded-full bg-brand-300/30 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/3 left-6 w-1 h-1 rounded-full bg-zinc-500/40 animate-float" style={{ animationDelay: '3s' }} />
              </div>
            </div>

          </div>
        </div>
      </section>
```

**Step 2: Replace the Ticker with Trust Bar (lines 166-182)**

Remove old ticker. Add trust bar:

```tsx
      {/* ══════ TRUST BAR ══════ */}
      <div className="border-y border-zinc-800 bg-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center font-mono text-xs text-zinc-600 uppercase tracking-[0.3em] mb-6">
            {t('trust.title')}
          </p>
          <div className="flex items-center justify-center gap-12 md:gap-16 opacity-50 hover:opacity-80 transition-opacity">
            {/* Dr. Raphael Cunha logo placeholder */}
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-400">RC</span>
              </div>
              <span className="font-display text-sm font-semibold text-zinc-400">Dr. Raphael Cunha</span>
            </div>
            {/* Placeholder clients */}
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
```

**Step 3: Remove old hooks/refs that are no longer needed**

Remove or keep as needed:
- Keep `useInView` and `useCountUp` hooks (still used in stats if we keep them, or remove if not)
- Remove `IMG1` and `IMG2` Supabase URLs (no longer used)
- Remove `tickerKeys` array
- Remove `statsSection`, `refLeads`, `refHours`, `refRoi` refs (stats section is being removed)

**Step 4: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: New hero with clean copy + glow orb on right. Trust bar below with Dr. Raphael name. No TypeScript errors.

**Step 5: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): rewrite hero + trust bar sections"
```

---

## Task 5: Add Problem section to Landing.tsx

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Add the Problem section after the Trust Bar**

Insert after the trust bar `</div>`:

```tsx
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
```

**Step 2: Add new icon sub-components at the bottom of the file**

Add `UsersIcon` and `CostIcon` alongside the existing icon components:

```tsx
const UsersIcon = () => (
  <svg className="w-5 h-5 text-zinc-500 group-hover:text-brand-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CostIcon = () => (
  <svg className="w-5 h-5 text-zinc-500 group-hover:text-brand-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
```

**Step 3: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Problem section visible after trust bar with 3 cards showing stats in green.

**Step 4: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): add problem section with pain point cards"
```

---

## Task 6: Rewrite Solution section in Landing.tsx

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Replace the old SERVICES section with the new Solution section**

Remove the entire old services section (the 2x2 grid with `ServiceCard` components). Replace with:

```tsx
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
```

**Step 2: Remove the old `ServiceCard` sub-component**

Delete the `ServiceCard` component definition (around lines 459-480 in original file), since it's no longer used.

**Step 3: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: 3 large rounded cards with glow hover, pill tags. No grid borders.

**Step 4: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): rewrite solution section with premium cards"
```

---

## Task 7: Add Case Study section in Landing.tsx

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Replace the old IMAGE SHOWCASE section with the Case study**

Remove the old image showcase section. Replace with:

```tsx
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
```

**Step 2: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Case study section with testimonial on left, 3 metric cards on right.

**Step 3: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): add case study section with Dr. Raphael testimonial"
```

---

## Task 8: Rewrite How it Works as vertical timeline

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Replace the old HOW IT WORKS section**

Remove old 3-col grid. Replace with vertical timeline:

```tsx
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
                {/* Timeline line */}
                {i < 2 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-700 group-hover:border-brand-300 transition-colors timeline-dot flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-brand-300 transition-colors" />
                </div>
                {/* Content */}
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
```

**Step 2: Remove the old STATS section**

Delete the entire stats section (the one with `statsSection.ref`, counters, etc). Also remove `useInView`, `useCountUp` hooks, and their refs (`statsSection`, `refLeads`, `refHours`, `refRoi`) since they're no longer used.

**Step 3: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Vertical timeline with 3 steps, dots, connecting lines. No stats section.

**Step 4: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): rewrite how-it-works as vertical timeline, remove stats"
```

---

## Task 9: Refine Pricing + Rewrite CTA Final

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Restyle the Pricing section**

Replace the pricing section with rounded cards (no grid borders):

```tsx
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
```

**Step 2: Replace the old CTA FINAL section**

Remove old CTA. Replace with:

```tsx
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
```

**Step 3: Verify**

Run: `cd AiForPurpose && npm run dev`
Expected: Pricing with 3 rounded cards (Growth highlighted with brand border + badge floating on top). CTA clean and centered.

**Step 4: Commit**

```bash
git add AiForPurpose/pages/Landing.tsx
git commit -m "feat(landing): restyle pricing with rounded cards, rewrite CTA"
```

---

## Task 10: Final cleanup and verification

**Files:**
- Modify: `AiForPurpose/pages/Landing.tsx`

**Step 1: Remove unused code**

- Remove `IMG1`, `IMG2` constants (Supabase image URLs — no longer referenced)
- Remove `useCountUp` hook (no longer used after stats removal)
- Remove `useInView` hook (no longer used)
- Remove `statsSection`, `refLeads`, `refHours`, `refRoi` refs
- Remove `tickerKeys` array
- Remove unused `ServiceCard` component
- Ensure `ClockIcon` is still defined (reused in Problem section) — keep it
- Remove unused `subtle` prop handling if `ServiceCard` is removed

**Step 2: Verify full page flow**

Run: `cd AiForPurpose && npm run dev`

Expected section order when scrolling:
1. Header (sticky)
2. Hero (clean copy + glow orb)
3. Trust Bar (logos)
4. Problem (3 pain cards)
5. Solution (3 service cards)
6. Case Study (testimonial + metrics)
7. How it Works (vertical timeline)
8. Pricing (3 rounded cards)
9. CTA Final (clean centered)
10. Footer
11. Agent Widget (floating bubble)

Verify:
- [ ] All 3 languages work (switch EN/PT/ES in header)
- [ ] CTA buttons open agent widget
- [ ] "Ver Cases" scrolls to case section
- [ ] Nav links scroll to correct sections
- [ ] Mobile menu works
- [ ] No console errors
- [ ] No TypeScript errors

**Step 3: Run build**

Run: `cd AiForPurpose && npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add AiForPurpose/
git commit -m "feat(landing): complete storytelling redesign — cleanup unused code"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | i18n keys (en/pt/es) | `i18n/translations.ts` |
| 2 | CSS animations | `index.html` |
| 3 | Header + Footer | `components/Layout.tsx` |
| 4 | Hero + Trust Bar | `pages/Landing.tsx` |
| 5 | Problem section | `pages/Landing.tsx` |
| 6 | Solution section | `pages/Landing.tsx` |
| 7 | Case Study section | `pages/Landing.tsx` |
| 8 | How it Works timeline | `pages/Landing.tsx` |
| 9 | Pricing + CTA | `pages/Landing.tsx` |
| 10 | Cleanup + verify | `pages/Landing.tsx` |
