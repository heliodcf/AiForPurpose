-- ==============================================================================
-- SUPABASE SCHEMA - AI FOR PURPOSE
-- Execute este script no SQL Editor do seu painel Supabase.
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- RESET LIMPO (Ordem corrigida para evitar erro 2BP01)
-- ==========================================

-- 1º: Apagamos as tabelas com CASCADE.
-- Isso destrói as tabelas E todas as políticas (RLS) associadas a elas.
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.intake_messages CASCADE;
DROP TABLE IF EXISTS public.intake_sessions CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2º: Agora que as políticas não existem mais, podemos apagar as funções tranquilamente.
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ==========================================
-- TABELAS
-- ==========================================

-- PROFILES: Vinculada aos usuários do Supabase Auth (Dashboard Admins)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'master')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LEADS: Capturados pelo Agente Widget
CREATE TABLE public.leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  source TEXT DEFAULT 'Agent Widget',
  status TEXT DEFAULT 'Novo'
);

-- INTAKE SESSIONS: A sessão do fluxo de briefing (coleta de dados)
CREATE TABLE public.intake_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ,
  bottleneck TEXT,
  channel TEXT,
  integrations TEXT,
  volume TEXT,
  timeline TEXT,
  summary TEXT,
  complexity_score INTEGER,
  estimate_low NUMERIC,
  estimate_high NUMERIC
);

-- INTAKE MESSAGES: O histórico do chat entre o Lead e o Agente
CREATE TABLE public.intake_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.intake_sessions(id) ON DELETE CASCADE NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'agent')) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS: Projetos criados automaticamente após a conclusão do Intake
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'Novo' CHECK (status IN ('Novo', 'Diagnóstico', 'Proposta', 'Em desenvolvimento', 'Entregue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Atualizar coluna 'updated_at' automaticamente nos Projetos
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar um Perfil automaticamente quando um novo usuário for registrado no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Administrador'), 
    'admin'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Função auxiliar para checar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'master')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
-- Admins podem ver a si mesmos e aos outros.
CREATE POLICY "Admins can view profiles" ON public.profiles FOR SELECT USING (public.is_admin() OR auth.uid() = id);
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- 2. Leads
-- Admins podem ler, atualizar e deletar. Usuários anônimos/visitantes podem INSERIR.
CREATE POLICY "Admins full access on leads" ON public.leads FOR ALL USING (public.is_admin());
CREATE POLICY "Anon can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- 3. Intake Sessions
-- Admins têm acesso total. Visitantes podem INSERIR e ATUALIZAR (para completar a sessão).
CREATE POLICY "Admins full access on intake_sessions" ON public.intake_sessions FOR ALL USING (public.is_admin());
CREATE POLICY "Anon can insert intake_sessions" ON public.intake_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update intake_sessions" ON public.intake_sessions FOR UPDATE USING (true);

-- 4. Intake Messages
-- Admins têm acesso total. Visitantes podem INSERIR.
CREATE POLICY "Admins full access on intake_messages" ON public.intake_messages FOR ALL USING (public.is_admin());
CREATE POLICY "Anon can insert intake_messages" ON public.intake_messages FOR INSERT WITH CHECK (true);

-- 5. Projects
-- Admins têm acesso total. Visitantes podem INSERIR (pois a lógica atual cria um projeto no momento em que o intake termina).
CREATE POLICY "Admins full access on projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Anon can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
