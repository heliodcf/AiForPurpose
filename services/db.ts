import { createClient } from "@supabase/supabase-js";
import {
  Lead,
  IntakeSession,
  IntakeMessage,
  Project,
  ProjectStatus,
  AdminUser,
} from "../types";

// ============================================================================
// CONFIGURAÇÃO SUPABASE
// ============================================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing. Check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper para gerar UUIDv4 localmente
function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class SupabaseDatabase {
  // ==========================================
  // AUTH & USERS
  // ==========================================

  async login(email: string, password: string): Promise<AdminUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    // Migrate local data if exists
    await this.migrateLocalData();

    // Busca os dados do perfil atrelados ao auth
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) throw new Error(profileError.message);

    if (!profile) {
      // Se o perfil não existe (usuário criado antes da trigger), cria agora
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, name: "Administrador", role: "admin" }]);
      if (insertError) {
        console.error("Erro ao criar perfil:", insertError.message);
        console.warn("Por favor, execute o script SQL 'supabase/fix_rls.sql' no seu painel Supabase para corrigir as permissões de RLS.");
      }
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || "Administrador",
      role: profile?.role || "admin",
      created_at: profile?.created_at || new Date().toISOString(),
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) return null;

    // Migrate local data if exists
    await this.migrateLocalData();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (!profile) {
      // Se o perfil não existe, cria agora
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: session.user.id, name: "Administrador", role: "admin" }]);
      if (insertError) {
        console.error("Erro ao criar perfil:", insertError.message);
        console.warn("Por favor, execute o script SQL 'supabase/fix_rls.sql' no seu painel Supabase para corrigir as permissões de RLS.");
      }
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      name: profile?.name || "Administrador",
      role: profile?.role || "admin",
      created_at: profile?.created_at || new Date().toISOString(),
    };
  }

  async migrateLocalData() {
    try {
      const localLeads = JSON.parse(localStorage.getItem('aifp_leads') || '[]');
      const localSessions = JSON.parse(localStorage.getItem('aifp_sessions') || '[]');
      const localMessages = JSON.parse(localStorage.getItem('aifp_messages') || '[]');
      const localProjects = JSON.parse(localStorage.getItem('aifp_projects') || '[]');

      if (localLeads.length === 0 && localProjects.length === 0) return;

      // Check if Supabase already has leads
      const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      if (count && count > 0) return; // Already migrated or has data

      console.log('Migrating local data to Supabase...');

      // Map old IDs to new UUIDs
      const leadIdMap: Record<string, string> = {};
      const sessionIdMap: Record<string, string> = {};

      const newLeads = localLeads.map((lead: any) => {
        const newId = generateUUID();
        leadIdMap[lead.id] = newId;
        return { ...lead, id: newId };
      });

      const newSessions = localSessions.map((session: any) => {
        const newId = generateUUID();
        sessionIdMap[session.id] = newId;
        return { 
          ...session, 
          id: newId, 
          lead_id: leadIdMap[session.lead_id] || session.lead_id 
        };
      });

      const newMessages = localMessages.map((msg: any) => {
        return { 
          ...msg, 
          id: generateUUID(), 
          session_id: sessionIdMap[msg.session_id] || msg.session_id 
        };
      });

      const newProjects = localProjects.map((proj: any) => {
        let status = proj.status;
        if (status === 'novo' || status === 'Novo' || status === 'NEW' || !status) {
          status = 'entrada_lead';
        }
        const { priority, ...restProj } = proj;
        return { 
          ...restProj, 
          id: generateUUID(), 
          lead_id: leadIdMap[proj.lead_id] || proj.lead_id,
          status
        };
      });

      let hasError = false;

      // Insert leads
      if (newLeads.length > 0) {
        const { error } = await supabase.from('leads').insert(newLeads);
        if (error) { console.error('Error inserting leads:', error); hasError = true; }
      }

      // Insert sessions
      if (newSessions.length > 0) {
        const { error } = await supabase.from('intake_sessions').insert(newSessions);
        if (error) { console.error('Error inserting sessions:', error); hasError = true; }
      }

      // Insert messages
      if (newMessages.length > 0) {
        const { error } = await supabase.from('intake_messages').insert(newMessages);
        if (error) { console.error('Error inserting messages:', error); hasError = true; }
      }

      // Insert projects
      if (newProjects.length > 0) {
        const { error } = await supabase.from('projects').insert(newProjects);
        if (error) { console.error('Error inserting projects:', error); hasError = true; }
      }

      if (!hasError) {
        console.log('Migration completed successfully.');
        
        // Clear local storage to prevent re-migration
        localStorage.removeItem('aifp_leads');
        localStorage.removeItem('aifp_sessions');
        localStorage.removeItem('aifp_messages');
        localStorage.removeItem('aifp_projects');
      } else {
        console.error('Migration completed with errors. Local storage not cleared.');
      }

    } catch (err) {
      console.error('Error migrating local data:', err);
    }
  }

  async getAdmins(): Promise<AdminUser[]> {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw new Error(error.message);

    // Supabase Auth esconde emails de outros usuários por padrão no frontend.
    // Retornamos um mock pro email aqui no painel se não usarmos edge functions (service_role)
    return data.map((p) => ({
      id: p.id,
      email: "protegido@aiforpurpose.com",
      name: p.name,
      role: p.role,
      created_at: p.created_at,
    }));
  }

  async createAdmin(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<any> {
    // Atenção: Fazer signUp direto no front-end logo após criar o projeto pode auto-logar o admin.
    // O ideal em produção é ter uma API route com a service_role key para criar usuários de admin.
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    });
    if (error) throw new Error(error.message);
    return authData;
  }

  // ==========================================
  // LEADS & INTAKE (AGENT WIDGET)
  // ==========================================

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const id = generateUUID();
    const payload = {
      id,
      name: leadData.name || "Desconhecido",
      company: leadData.company || null,
      role: leadData.role || null,
      email: leadData.email || null,
      phone: leadData.phone || null,
      source: "Agent Widget",
      status: "Novo",
    };

    // Removemos o .select().single() para evitar erro de RLS de leitura (anônimo não pode ler, só inserir)
    const { error } = await supabase.from("leads").insert([payload]);

    if (error) throw new Error(error.message);
    return { created_at: new Date().toISOString(), ...payload } as Lead;
  }


  async createIntakeSession(leadId: string): Promise<IntakeSession> {
    const id = generateUUID();
    const payload = { id, lead_id: leadId };

    const { error } = await supabase.from("intake_sessions").insert([payload]);

    if (error) throw new Error(error.message);
    return {
      started_at: new Date().toISOString(),
      ...payload,
    } as IntakeSession;
  }

  async saveMessage(
    sessionId: string,
    sender: "user" | "agent",
    message: string,
  ): Promise<IntakeMessage> {
    const id = generateUUID();
    const payload = { id, session_id: sessionId, sender, message };

    const { error } = await supabase.from("intake_messages").insert([payload]);

    if (error) throw new Error(error.message);
    return {
      created_at: new Date().toISOString(),
      ...payload,
    } as IntakeMessage;
  }

  async completeIntake(sessionId: string, sessionData: Partial<IntakeSession>): Promise<IntakeSession> {
    if (sessionData.lead_id && sessionData.name) {
      await supabase
        .from('leads')
        .update({ 
          name: sessionData.name,
          company: sessionData.company,
          role: sessionData.role 
        })
        .eq('id', sessionData.lead_id)
        .eq('name', 'Visitante'); // só atualiza se ainda está como "Visitante"
    }

    const completed_at = new Date().toISOString();
    const payload = {
      bottleneck: sessionData.bottleneck,
      channel: sessionData.channel,
      integrations: sessionData.integrations,
      volume: sessionData.volume,
      timeline: sessionData.timeline,
      summary: sessionData.summary,
      completed_at
    };

    const { error } = await supabase
      .from('intake_sessions')
      .update(payload)
      .eq('id', sessionId);

    if (error) throw new Error(error.message);

    // Auto-cria o projeto após finalizar o briefing se tivermos o lead_id guardado no estado
    if (sessionData.lead_id) {
      // Remove qualquer projeto de carrinho abandonado antes de criar o projeto real
      await supabase
        .from('projects')
        .delete()
        .eq('lead_id', sessionData.lead_id)
        .eq('status', 'carrinho_perdido');

      const projectId = generateUUID();
      await supabase.from('projects').insert([{
        id: projectId,
        lead_id: sessionData.lead_id,
        status: 'entrada_lead',
        notes: `Briefing recebido via Agente Inteligente. Gargalo: ${sessionData.bottleneck}. Prazo: ${sessionData.timeline}`
      }]);
    }

    return { id: sessionId, ...sessionData, completed_at } as IntakeSession;
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<void> {
    // Apenas envia os campos que possuem valor definido
    const payload: Record<string, any> = {};
    const fields: (keyof Lead)[] = ['name', 'company', 'role', 'email', 'phone', 'location', 'status'];
    for (const field of fields) {
      if (updates[field] !== undefined) {
        payload[field] = updates[field];
      }
    }
    if (Object.keys(payload).length === 0) return;

    const { error } = await supabase
      .from('leads')
      .update(payload)
      .eq('id', leadId);

    if (error) throw new Error(error.message);
  }

  async getAbandonedCarts() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        lead:leads(*)
      `)
      .eq('status', 'carrinho_perdido')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((project: any) => ({
      ...project,
      lead: Array.isArray(project.lead) ? project.lead[0] : project.lead
    }));
  }

  async recoverLead(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'entrada_lead' })
      .eq('id', projectId);

    if (error) throw new Error(error.message);
  }

  // ==========================================
  // ABANDONED CARTS
  // ==========================================

  async createAbandonedCart(leadId: string): Promise<void> {
    // Verifica se já existe QUALQUER projeto para este lead
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, status')
      .eq('lead_id', leadId)
      .limit(1);

    // Se já tem projeto (qualquer status), não cria carrinho
    if (existingProjects && existingProjects.length > 0) return;

    const projectId = generateUUID();
    const { error } = await supabase
      .from('projects')
      .insert([{
        id: projectId,
        lead_id: leadId,
        status: 'carrinho_perdido',
        notes: 'Lead iniciou contato mas não finalizou o briefing.'
      }]);

    if (error) console.error('Erro ao criar carrinho abandonado:', error.message);
  }

  // ==========================================
  // KANBAN CRM DATA
  // ==========================================

  async getProjectsWithLeads(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        lead:leads(*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Project[];
  }

  async updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
  ): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId);

    if (error) throw new Error(error.message);
  }

  async updateProjectDetails(
    projectId: string,
    details: Partial<Project>,
  ): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update(details)
      .eq("id", projectId);

    if (error) throw new Error(error.message);
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) throw new Error(error.message);
  }

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  async getDashboardStats() {
    // Busca contagens exatas usando a API do Supabase
    const [leadsCount, projectsCount, intakesCount, abandonedCartsCount] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .neq("status", ProjectStatus.FECHADO_GANHO)
        .neq("status", ProjectStatus.FECHADO_PERDIDO),
      supabase
        .from("intake_sessions")
        .select("*", { count: "exact", head: true })
        .not("completed_at", "is", "null"),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", ProjectStatus.CARRINHO_PERDIDO),
    ]);

    return {
      totalLeads: leadsCount.count || 0,
      activeProjects: projectsCount.count || 0,
      completedIntakes: intakesCount.count || 0,
      abandonedCarts: abandonedCartsCount.count || 0,
    };
  }

  async getLeadsWithDetails(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Relacionamento PostgREST: Traz o Lead e a Sessão de Intake em uma única query
    const { data, error, count } = await supabase
      .from("leads")
      .select(
        `
        *,
        session:intake_sessions(*)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    // Formata o array (a join volta como array no Supabase, pegamos o índice 0)
    const formattedData = data.map((lead: any) => ({
      ...lead,
      session: lead.session && lead.session.length > 0 ? lead.session[0] : null,
    }));

    return {
      data: formattedData,
      totalCount: count || 0,
      page,
      limit,
    };
  }

}

export const db = new SupabaseDatabase();
