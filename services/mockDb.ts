import { Lead, IntakeSession, IntakeMessage, Project, ProjectStatus, AdminUser } from '../types';

// Helper to generate UUIDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Simulates API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * ⚠️ AVISO DE SEGURANÇA ⚠️
 * Este arquivo (mockDb.ts) é APENAS para desenvolvimento local e testes.
 * NUNCA utilize este arquivo em um ambiente de produção.
 * Em produção, utilize a integração real com o Supabase (db.ts).
 */
class MockDatabase {
  constructor() {
    this.initMasterAdmin();
  }

  private get<T>(key: string): T[] {
    const data = localStorage.getItem(`aifp_${key}`);
    return data ? JSON.parse(data) : [];
  }

  private set<T>(key: string, data: T[]) {
    localStorage.setItem(`aifp_${key}`, JSON.stringify(data));
  }

  // Auth & Users
  private initMasterAdmin() {
    const users = this.get<any>('admin_users');
    if (users.length === 0) {
      // Create default master admin if none exists
      // Utiliza variáveis de ambiente para evitar credenciais hardcoded
      const adminEmail = import.meta.env.VITE_MOCK_ADMIN_EMAIL || 'admin@aiforpurpose.com';
      const adminPassword = import.meta.env.VITE_MOCK_ADMIN_PASSWORD || 'admin';
      
      this.set('admin_users', [{
        id: 'master-admin-id',
        email: adminEmail,
        password: adminPassword, // In a real app, this would be hashed!
        name: 'Master Admin',
        role: 'master',
        created_at: new Date().toISOString()
      }]);
    }
  }

  async login(email: string, password: string): Promise<AdminUser> {
    await delay(500);
    const users = this.get<any>('admin_users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) throw new Error('Credenciais inválidas');
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('aifp_session', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem('aifp_session');
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    await delay(100);
    const session = localStorage.getItem('aifp_session');
    return session ? JSON.parse(session) : null;
  }

  async getAdmins(): Promise<AdminUser[]> {
    await delay(300);
    const users = this.get<any>('admin_users');
    return users.map(({ password, ...rest }) => rest);
  }

  async createAdmin(data: { email: string; name: string; password: string }): Promise<AdminUser> {
    await delay(500);
    const users = this.get<any>('admin_users');
    
    if (users.some(u => u.email === data.email)) {
      throw new Error('E-mail já está em uso.');
    }

    const newUser = {
      id: generateId(),
      email: data.email,
      name: data.name,
      password: data.password, // Mock only
      role: 'admin',
      created_at: new Date().toISOString()
    };

    this.set('admin_users', [...users, newUser]);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as AdminUser;
  }

  // Leads & Intake
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    await delay(300);
    const leads = this.get<Lead>('leads');
    const newLead: Lead = {
      id: generateId(),
      created_at: new Date().toISOString(),
      name: leadData.name || 'Desconhecido',
      company: leadData.company || '',
      role: leadData.role || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      source: 'Agent Widget',
      status: 'Novo',
      ...leadData
    };
    this.set('leads', [...leads, newLead]);
    return newLead;
  }

  async createIntakeSession(leadId: string): Promise<IntakeSession> {
    await delay(200);
    const sessions = this.get<IntakeSession>('sessions');
    const newSession: IntakeSession = {
      id: generateId(),
      lead_id: leadId,
      started_at: new Date().toISOString()
    };
    this.set('sessions', [...sessions, newSession]);
    return newSession;
  }

  async saveMessage(sessionId: string, sender: 'user' | 'agent', message: string): Promise<IntakeMessage> {
    const messages = this.get<IntakeMessage>('messages');
    const newMsg: IntakeMessage = {
      id: generateId(),
      session_id: sessionId,
      sender,
      message,
      created_at: new Date().toISOString()
    };
    this.set('messages', [...messages, newMsg]);
    return newMsg;
  }

  async completeIntake(sessionId: string, data: Partial<IntakeSession>): Promise<IntakeSession> {
    await delay(500);
    const sessions = this.get<IntakeSession>('sessions');
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index === -1) throw new Error('Session not found');

    const updatedSession = {
      ...sessions[index],
      ...data,
      completed_at: new Date().toISOString()
    };
    sessions[index] = updatedSession;
    this.set('sessions', sessions);

    // Auto-create a project when intake completes
    const projects = this.get<Project>('projects');
    const newProject: Project = {
      id: generateId(),
      lead_id: updatedSession.lead_id,
      status: ProjectStatus.NEW,
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: `Briefing recebido via Agente Inteligente. Gargalo: ${updatedSession.bottleneck}. Prazo: ${updatedSession.timeline}`
    };
    this.set('projects', [...projects, newProject]);

    return updatedSession;
  }

  async getDashboardStats() {
    await delay(300);
    const leads = this.get<Lead>('leads');
    const projects = this.get<Project>('projects');
    const sessions = this.get<IntakeSession>('sessions');

    return {
      totalLeads: leads.length,
      activeProjects: projects.filter(p => p.status !== ProjectStatus.DELIVERED).length,
      completedIntakes: sessions.filter(s => s.completed_at).length
    };
  }

  async getLeadsWithDetails(page: number = 1, limit: number = 10) {
    await delay(300);
    const leads = this.get<Lead>('leads');
    const sessions = this.get<IntakeSession>('sessions');

    const formattedData = leads.map(lead => {
      const session = sessions.find(s => s.lead_id === lead.id);
      return { ...lead, session };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const offset = (page - 1) * limit;
    const paginatedData = formattedData.slice(offset, offset + limit);

    return {
      data: paginatedData,
      totalCount: formattedData.length,
      page,
      limit
    };
  }
}

export const db = new MockDatabase();
