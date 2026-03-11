# AI For Purpose

## Escopo

Plataforma full-stack para a marca **AI For Purpose** — empresa que vende automacao com IA e agentes inteligentes para negocios. Tres pilares: Landing Page de conversao, Agent Widget (intake conversacional que qualifica leads e gera estimativa de orcamento), e Dashboard Admin com CRM completo (Kanban, metricas, leads, carrinhos abandonados).

**Para quem:** Empresas B2B que querem vender servicos de automacao com IA (agentes de WhatsApp, Instagram, Telegram, Voice).

**Problema que resolve:** Automatiza a captacao e qualificacao de leads via chatbot inteligente, elimina intake manual, e centraliza o pipeline de vendas num CRM integrado.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + TypeScript (SPA) |
| Styling | Tailwind CSS (CDN v3) + Plus Jakarta Sans / DM Sans / Space Mono |
| Build | Vite 6 |
| Backend/DB | Supabase (Auth + PostgreSQL + RLS) |
| i18n | Custom translation system (PT-BR, EN, ES) |
| Routing | Hash-based SPA (`/#/admin`, `/#/admin/leads`) |
| Deploy | Netlify (SPA redirect) |
| Automacao | N8N webhook (opcional) |

---

## Skills Utilizadas

| Skill | Quando usar |
|-------|-------------|
| `senior-frontend` | Componentes React, pages, hooks, contextos |
| `frontend-design` + `ui-ux-pro-max` | Landing page, dashboard, widget design |
| `tailwind-4` | Estilizacao Tailwind |
| `brainstorming` | Novas features (ex: integracao LLM no widget) |
| `writing-plans` | Tasks multi-step (ex: migrar para Next.js) |
| `systematic-debugging` | Debug do Agent Widget state machine |
| `landing-page-copywriter` | Copy da landing page |
| `verification-before-completion` | Antes de deploy |

---

## Etapas do Projeto

| Etapa | Descricao | Status |
|-------|-----------|--------|
| 1. Landing Page | Hero, value props, pricing, stats, CTA, SEO | done |
| 2. Agent Widget | State machine conversacional, captacao de leads, estimativa de orcamento | done |
| 3. Admin Dashboard | Metricas overview, cards de KPIs | done |
| 4. Admin Leads | Tabela de leads com filtros, detalhes de intake | done |
| 5. Admin Kanban | Pipeline CRM com drag-and-drop por status | done |
| 6. Admin Users | Gestao de usuarios admin | done |
| 7. Abandoned Carts | Recuperacao de leads que abandonaram o intake | done |
| 8. Supabase Integration | Migracao de mockDb para Supabase real com RLS | done |
| 9. i18n | Traducoes PT-BR, EN, ES | done |
| 10. N8N Webhook | Integracao com N8N para automacoes | done |
| 11. LLM Integration | Gemini/OpenAI no Agent Widget (respostas inteligentes) | todo |
| 12. Testes | Suite de testes (nao configurada) | todo |
| 13. Migracao Next.js | App Router + SSR + SEO server-side | todo |

---

## Decisoes de Arquitetura

1. **SPA com hash routing** — Permite deploy em Netlify sem configuracao de server-side routing. Trade-off: SEO limitado (resolvivel com migracao Next.js futura).
2. **Supabase como backend** — Auth + DB + RLS numa unica plataforma. Sem necessidade de backend custom. RLS garante seguranca direto no PostgreSQL.
3. **DB abstraction layer** — `db.ts` (Supabase) e `mockDb.ts` (localStorage) exportam mesma interface. Toggle via `VITE_USE_MOCK_DB`. Facilita desenvolvimento local sem Supabase.
4. **Agent Widget como state machine** — Fluxo determinista com estados sequenciais. Persistencia via sessionStorage (sobrevive refresh). Timeout de 1h. Preparado para receber chamadas de LLM no futuro.
5. **UUID client-side** — `crypto.randomUUID()` com fallback. IDs gerados no frontend antes do INSERT no Supabase. Evita round-trip extra.
6. **Auto-migracao localStorage → Supabase** — `db.ts` migra dados do localStorage para Supabase no primeiro login autenticado. Transicao transparente do mock para producao.
7. **Kanban por status, sem campo priority** — Pipeline usa status-based ordering. Statuses: `carrinho_perdido → entrada_lead → preparacao_quote → quote_enviada → follow_up → fechado_ganho | fechado_perdido`.

---

## Aprendizados

1. **watcherDisparado bug** — Logica do watcher no Agent Widget tinha condicao de corrida. Fix: adicionar logs de diagnostico e corrigir sequencia de verificacao (commit `5927243`).
2. **Tailwind via CDN** — Funciona para SPA rapida, mas limita customizacao avancada. Para producao seria, migrar para Tailwind local com PostCSS.
3. **RLS com anonymous inserts** — Supabase permite INSERT anonimo para o widget, mas precisa de rate limiting em producao para evitar spam.
4. **SessionStorage vs localStorage** — AgentWidget usa sessionStorage (limpa ao fechar aba) para dados temporarios do fluxo. Leads finalizados vao para Supabase (persistente).
5. **Bug carrinho perdido no modo N8N** — Root cause: frontend delegava criacao de lead+carrinho pro N8N, mas N8N nunca retornava leadId. Resultado: carrinho_perdido nunca era criado, e quando intake completava, `completeIntake` nao tinha leadId pra remover carrinho e criar projeto. Fix (2026-03-10): AgentWidget.tsx agora cria lead + carrinho_perdido LOCALMENTE no Supabase ANTES de chamar N8N. N8N recebe o leadId real no payload pra automacoes downstream.
6. **Leads duplicados no N8N save_lead** — Com o fix #5, o frontend cria o lead antes. Mas o sub-workflow "Salvar Lead - Supabase" fazia INSERT cego, criando lead duplicado com mesmo email. Fix (2026-03-10): Reestruturado sub-workflow para Buscar Lead por email PRIMEIRO → IF existe? → true: Atualizar Lead com dados completos (nome, company, role) → false: Inserir Lead novo. Ambos paths convergem em Inserir Sessao.
7. **Aria repetitiva + erro ao salvar lead (N8N)** — Root cause: no `Inserir Lead` do sub-workflow `Salvar Lead - Supabase` (`6k69EieaO0yyx3z2`) usava `autoMapInputData`, que mapeava dados do no anterior (`Lead Existe?` branch FALSE). O IF repassava item vazio `{}` do `Buscar Lead` (sem resultado), causando `name=null` → Supabase rejeitava com NOT NULL constraint. O AI Agent via o erro e re-perguntava dados ja coletados, criando loop infinito. Fix (2026-03-11): Trocado `Inserir Lead` de `autoMapInputData` para `defineBelow` com campos mapeados explicitamente do `$('Trigger').item.json.*`. Licao: em sub-workflows N8N com branching (IF), NUNCA usar `autoMapInputData` apos um IF — os dados do Trigger se perdem no caminho. Sempre usar `defineBelow` referenciando o Trigger.

---

## Como Usar

```bash
# Desenvolvimento
npm run dev         # Vite dev server em http://localhost:3000

# Producao
npm run build       # Build
npm run preview     # Preview local do build
```

1. Landing page carrega em `/`
2. Interaja com o widget do bot (canto inferior direito)
3. Dashboard admin em `/#/admin` (requer login)

---

## Migrando para Producao (Vercel + Supabase)

1. Crie projeto no Supabase
2. Execute `supabase/schema.sql` no SQL Editor
3. Configure `.env`:
   ```env
   VITE_SUPABASE_URL=sua_url
   VITE_SUPABASE_ANON_KEY=sua_chave_anon
   VITE_USE_MOCK_DB=false
   ```
4. Deploy na Netlify/Vercel

---

## Database Schema

| Tabela | Funcao |
|--------|--------|
| profiles | Admin users (linked to Supabase Auth) |
| leads | Captados via Agent Widget |
| intake_sessions | Dados do fluxo de briefing |
| intake_messages | Historico de chat lead ↔ agente |
| projects | Pipeline CRM com statuses Kanban |

RLS ativo em todas as tabelas. Schema completo em `supabase/schema.sql`.

Ver [CLAUDE.md](CLAUDE.md) para instrucoes detalhadas do projeto.
