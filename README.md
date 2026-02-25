# AI For Purpose - Plataforma Full-Stack

Projeto completo para a marca **AI For Purpose**, incluindo uma Landing Page otimizada para SEO e conversão, um Agente Inteligente (Intake Widget) e um Dashboard Admin.

## Arquitetura e Ambiente

Este projeto foi gerado para rodar perfeitamente neste ambiente isolado como uma **Single Page Application (SPA) React**. 

Para permitir que você teste a experiência *Full-Stack completa* sem precisar configurar um banco de dados real imediatamente, implementamos um **Mock Service (`services/mockDb.ts`)** que utiliza o `localStorage` do navegador para simular as inserções e leituras de Banco de Dados. 

*Experimente conversar com o Agente na Landing Page e, em seguida, navegue para `/admin` (Dashboard) para ver o lead capturado em tempo real!*

### Estrutura (Preparada para Next.js / Supabase)
Embora rodando como SPA aqui, a estrutura de código foi desenhada pensando em uma fácil migração para **Next.js (App Router)** e **Supabase**:
- As chamadas de DB estão isoladas no `mockDb.ts`. Para conectar ao Supabase real, basta substituir esta classe por chamadas reais via `@supabase/supabase-js`.
- O arquivo `supabase/schema.sql` contém a estrutura relacional completa e as políticas de segurança (RLS) prontas para serem executadas no painel SQL do seu projeto Supabase.

## Como usar localmente
1. A Landing page inicial carrega em `/`.
2. Interaja com o widget do bot (canto inferior direito) e preencha o fluxo.
3. Clique em "Dashboard" no cabeçalho ou navegue manualmente para `/#/admin`.
4. Você verá as métricas atualizadas e o seu lead na aba "Leads & Intakes".

## Migrando para Produção (Vercel + Supabase)
1. Crie um projeto no Supabase.
2. Execute o conteúdo de `supabase/schema.sql` no SQL Editor do Supabase.
3. Configure suas variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta (Apenas para rotas de API seguras)
   ```
4. Substitua a classe em `services/mockDb.ts` pelo cliente oficial do Supabase.
5. Faça o deploy na Vercel!

## Funcionalidades Chave
- **SEO & Copy Premium**: Linguagem focada em resultados (ROI, redução de tempo), design SaaS.
- **Agent Widget**: Uma state machine no frontend que guia o usuário por perguntas chave, retém o lead e aplica heurísticas locais para gerar um range de orçamento. Preparado para receber chamadas de LLM (Gemini/OpenAI) futuramente.
- **Admin Dashboard**: Visão geral de métricas, tabela de leads e visualização de projetos criados a partir dos intakes finalizados.
