export enum ProjectStatus {
  NEW = 'Novo',
  DIAGNOSIS = 'Diagnóstico',
  PROPOSAL = 'Proposta',
  DEVELOPMENT = 'Em desenvolvimento',
  DELIVERED = 'Entregue'
}

export enum ChannelType {
  WHATSAPP = 'WhatsApp',
  INSTAGRAM = 'Instagram',
  TELEGRAM = 'Telegram',
  WEB = 'Site',
  VOICE = 'Voz'
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  role?: string;
  email: string;
  phone?: string;
  location?: string;
  source: string;
  status: string;
}

export interface IntakeSession {
  id: string;
  lead_id: string;
  started_at: string;
  completed_at?: string;
  bottleneck?: string;
  channel?: string;
  integrations?: string;
  volume?: string;
  timeline?: string;
  summary?: string;
}

export interface IntakeMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'agent';
  message: string;
  created_at: string;
  isTranslatable?: boolean;
}

export interface Project {
  id: string;
  lead_id: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'admin';
  created_at: string;
}

// Agent Flow Types
export enum AgentStep {
  INIT,
  NAME,
  COMPANY,
  ROLE,
  EMAIL,
  PHONE,
  BOTTLENECK,
  CHANNEL,
  INTEGRATIONS,
  VOLUME,
  TIMELINE,
  DONE
}
