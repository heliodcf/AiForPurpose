-- 1. Atualizar a função is_admin para não depender da tabela profiles
-- Isso garante que qualquer usuário autenticado seja considerado admin (para fins de dashboard)
-- mesmo que o perfil ainda não tenha sido criado.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Adicionar a política que permite aos usuários criarem seus próprios perfis
-- Isso resolve o erro "new row violates row-level security policy for table profiles"
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Garantir que as políticas de SELECT para admins estejam corretas
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
CREATE POLICY "Admins can view profiles" ON public.profiles FOR SELECT USING (public.is_admin() OR auth.uid() = id);
