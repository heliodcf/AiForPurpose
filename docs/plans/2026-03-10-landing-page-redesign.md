# Landing Page Redesign — "Storytelling Cinematico"

**Data:** 2026-03-10
**Projeto:** AiForPurpose
**Escopo:** Landing page publica (admin fica como esta)
**Objetivo:** Conversao + presenca premium
**Abordagem:** B — Storytelling Cinematico (problema > solucao > prova > acao)

---

## Decisoes de Design

| Decisao | Escolha |
|---------|---------|
| Objetivo | Conversao + branding premium |
| Widget | Manter flutuante (bubble no canto) |
| Social proof | Case real Dr. Raphael Cunha (logo + depoimento) |
| Escopo | So landing page publica |
| Visual | Dark + neon green como micro-accent |

---

## Estrutura da Pagina (9 secoes)

### 1. HEADER (Layout.tsx — refinamento)
- Logo mantido: `AI` (brand-300) + `For Purpose` (white) + dot animado
- Nav: Solucoes | Cases | Planos | Como Funciona
- CTA: "Fale com a Aria →" (nome do agente no botao)
- Remover link "Dashboard" do nav publico
- Scroll: backdrop-blur forte + border sutil

### 2. HERO
- **Layout:** Full-width, centrado, min-h-screen
- **Badge:** `Agentes de IA que trabalham por voce — 24/7`
- **H1:** `Pare de perder clientes.\nComece a escalar.` (ultima parte em brand-300)
- **Tamanho:** `text-6xl md:text-7xl lg:text-8xl`, font-display, weight 800
- **Sub:** `Automacao inteligente que atende, qualifica e converte — enquanto voce foca no que importa.`
- **CTAs:** `[ Fale com a Aria → ]` (primary) + `[ Ver Cases ↓ ]` (ghost)
- **Hint:** `Sem compromisso. Resposta em segundos.`
- **Visual:** zinc-950 + gradiente radial brand-300/5 no centro
- **Lado direito (desktop):** Glow orb animado com particulas — visual "IA viva"
- **Remove:** Metrics panel rigido

### 3. TRUST BAR (nova)
- Texto: `Empresas usando nossos agentes`
- Logos: Dr. Raphael Cunha + 2-3 placeholders
- Grayscale com hover colorido
- `bg-zinc-900`, borders `zinc-800`
- Ticker se 4+ logos, statico se menos

### 4. O PROBLEMA (nova)
- **Titulo:** `Sua equipe ainda atende manualmente?`
- **3 cards em row:**
  - Leads perdidos fora do horario comercial — "67% dos leads entram fora do expediente"
  - Equipe sobrecarregada com tarefas repetitivas — "4h/dia em perguntas repetidas"
  - Custo alto pra escalar — "R$5k+/mes por pessoa"
- Cards: `bg-zinc-900/50` + border `zinc-800`
- Numeros em `text-brand-300`
- Transicao: `E se voce pudesse resolver tudo isso com IA?`

### 5. A SOLUCAO (substitui SERVICES)
- **Titulo:** `Atendimento inteligente em todos os canais`
- **3 cards grandes (p-12):**
  - Agentes de Mensagem (WhatsApp, IG, Telegram, Web)
  - Agente de Voz (URA IA, NLP, telefone)
  - Conversao Automatica (qualificacao, follow-up, nurturing)
- Visual: `bg-zinc-900/30`, hover `bg-zinc-900/60` + border-glow brand-300/20
- Sem grid borders, cards com rounded + shadow
- Tags como pills

### 6. CASE REAL (substitui IMAGE SHOWCASE)
- **Layout 2 colunas:**
  - Esquerda: Depoimento real em `text-xl italic text-zinc-300`, aspas estilizadas, nome + cargo + logo
  - Direita: Metricas do case em mini-cards (brand-300), screenshot/mockup
- Background: gradiente sutil diferenciado
- **Dados necessarios do owner:** texto depoimento, metricas reais, logo

### 7. COMO FUNCIONA (refinamento)
- **De:** Grid 3 colunas → **Para:** Timeline vertical
- Linha conectora `border-l-2 border-zinc-800`
- 3 steps:
  1. Briefing em 5 minutos — Converse com a Aria
  2. Implementacao sob medida — Agentes nos canais certos
  3. Escala automatica — 24/7, dashboard em tempo real
- Numeros grandes em brand-300, hover brilho

### 8. PRICING (refinamento)
- Manter 3 tiers com nomes e proposta distintos
- Growth (meio) com destaque: borda brand-300, badge "Popular"
- Cards com `rounded-2xl` + shadows (sem grid borders)
- Todos CTAs → "Fale com a Aria"

### 9. CTA FINAL
- **H2:** `Pronto pra escalar seu atendimento?`
- **Sub:** `Converse com a Aria agora. Sem compromisso. Resultado em dias, nao meses.`
- **CTA:** `[ Comecar Agora → ]`
- Gradiente radial brand-300/8, centrado, clean

---

## Sistema Visual

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Borders | Grid borders por toda parte | Cards com spacing + shadow/glow |
| Cor accent | Neon green dominante | Neon green como micro-accent |
| Hero | Metrics panel rigido | Copy focado + glow orb |
| Images | 2 imgs genericas | Case real com depoimento |
| Ticker | 8 keywords | Trust bar com logos |
| Footer | Links mortos | Links reais ou removidos |
| How it works | Grid 3 cols | Timeline vertical |
| Cards | Flat + border | Rounded + shadow + glow hover |

---

## Arquivos Impactados

| Arquivo | Acao |
|---------|------|
| `pages/Landing.tsx` | Reescrever quase por completo |
| `components/Layout.tsx` | Ajustar header nav + footer |
| `i18n/translations.ts` | Novas keys pra secoes novas (problema, trust bar, case) |
| `index.html` | Possivel ajuste de animations/keyframes |

---

## Concorrentes Pesquisados

| Referencia | Inspiracao |
|-----------|-----------|
| Bland.ai | Hero focado em 1 acao, tipografia bold, copy direto |
| Beautiful.ai | Mostra produto funcionando |
| Superside | Social proof pesado (logos, numeros, cases) |
| Tendencia 2026 | Neon como micro-accent, dark mode padrao, spacing generoso |

---

## Requisitos do Owner

- [ ] Texto do depoimento do Dr. Raphael Cunha
- [ ] Metricas reais do case (atendimentos/mes, reducao custo, etc.)
- [ ] Logo da clinica do Dr. Raphael
- [ ] Screenshot ou mockup do produto em uso (opcional)
