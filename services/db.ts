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

    // Busca os dados do perfil atrelados ao auth
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    return {
      id: data.user.id,
      email: data.user.email!,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at,
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profile) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at,
    };
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

  async completeIntake(
    sessionId: string,
    sessionData: Partial<IntakeSession>,
  ): Promise<IntakeSession> {
    const completed_at = new Date().toISOString();
    const payload = {
      bottleneck: sessionData.bottleneck,
      channel: sessionData.channel,
      integrations: sessionData.integrations,
      volume: sessionData.volume,
      timeline: sessionData.timeline,
      summary: sessionData.summary,
      completed_at,
    };

    const { error } = await supabase
      .from("intake_sessions")
      .update(payload)
      .eq("id", sessionId);

    if (error) throw new Error(error.message);

    // Auto-cria o projeto após finalizar o briefing se tivermos o lead_id guardado no estado
    if (sessionData.lead_id) {
      const projectId = generateUUID();
      const { error: projectError } = await supabase.from("projects").insert([
        {
          id: projectId,
          lead_id: sessionData.lead_id,
          status: ProjectStatus.ENTRADA_LEAD,
          notes: `Briefing recebido via Agente Inteligente. Gargalo: ${sessionData.bottleneck}. Prazo: ${sessionData.timeline}`,
        },
      ]);

      if (projectError) {
        console.error("Erro ao criar projeto no CRM:", projectError);
        // Não vamos lançar o erro para não quebrar o fluxo do usuário,
        // mas o erro será logado no console.
      }
    }

    return { id: sessionId, ...sessionData, completed_at } as IntakeSession;
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
    const [leadsCount, projectsCount, intakesCount] = await Promise.all([
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
    ]);

    return {
      totalLeads: leadsCount.count || 0,
      activeProjects: projectsCount.count || 0,
      completedIntakes: intakesCount.count || 0,
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
  async getAbandonedCarts(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("projects")
      .select(
        `
        *,
        lead:leads(*)
      `,
        { count: "exact" },
      )
      .eq("status", ProjectStatus.CARRINHO_PERDIDO)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      data: data,
      totalCount: count || 0,
      page,
      limit,
    };
  }
}

export const db = new SupabaseDatabase();
