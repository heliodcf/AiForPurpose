import React, { useState, useEffect, useRef, useMemo } from "react";
import Markdown from "react-markdown";
import { AgentStep, IntakeMessage } from "../types";
import { db } from "../services/db";
import { IconBot, IconX, IconSend } from "./Icons";
import { useLanguage } from "../contexts/LanguageContext";
import { useRouter } from "../contexts/RouterContext";

// Timezone → country/region detection (zero API, zero permission)
interface GeoContext {
  country: string;
  countryCode: string;
  region: "latam" | "north_america" | "europe" | "asia" | "other";
  timezone: string;
}

const TIMEZONE_COUNTRY_MAP: Record<string, { country: string; code: string; region: GeoContext["region"] }> = {
  // Latin America
  "America/Sao_Paulo": { country: "BR", code: "+55", region: "latam" },
  "America/Fortaleza": { country: "BR", code: "+55", region: "latam" },
  "America/Recife": { country: "BR", code: "+55", region: "latam" },
  "America/Bahia": { country: "BR", code: "+55", region: "latam" },
  "America/Belem": { country: "BR", code: "+55", region: "latam" },
  "America/Manaus": { country: "BR", code: "+55", region: "latam" },
  "America/Cuiaba": { country: "BR", code: "+55", region: "latam" },
  "America/Campo_Grande": { country: "BR", code: "+55", region: "latam" },
  "America/Porto_Velho": { country: "BR", code: "+55", region: "latam" },
  "America/Rio_Branco": { country: "BR", code: "+55", region: "latam" },
  "America/Araguaina": { country: "BR", code: "+55", region: "latam" },
  "America/Noronha": { country: "BR", code: "+55", region: "latam" },
  "America/Buenos_Aires": { country: "AR", code: "+54", region: "latam" },
  "America/Argentina/Buenos_Aires": { country: "AR", code: "+54", region: "latam" },
  "America/Mexico_City": { country: "MX", code: "+52", region: "latam" },
  "America/Bogota": { country: "CO", code: "+57", region: "latam" },
  "America/Santiago": { country: "CL", code: "+56", region: "latam" },
  "America/Lima": { country: "PE", code: "+51", region: "latam" },
  "America/Caracas": { country: "VE", code: "+58", region: "latam" },
  "America/Montevideo": { country: "UY", code: "+598", region: "latam" },
  "America/Asuncion": { country: "PY", code: "+595", region: "latam" },
  "America/La_Paz": { country: "BO", code: "+591", region: "latam" },
  "America/Guayaquil": { country: "EC", code: "+593", region: "latam" },
  // North America
  "America/New_York": { country: "US", code: "+1", region: "north_america" },
  "America/Chicago": { country: "US", code: "+1", region: "north_america" },
  "America/Denver": { country: "US", code: "+1", region: "north_america" },
  "America/Los_Angeles": { country: "US", code: "+1", region: "north_america" },
  "America/Phoenix": { country: "US", code: "+1", region: "north_america" },
  "America/Anchorage": { country: "US", code: "+1", region: "north_america" },
  "Pacific/Honolulu": { country: "US", code: "+1", region: "north_america" },
  "America/Toronto": { country: "CA", code: "+1", region: "north_america" },
  "America/Vancouver": { country: "CA", code: "+1", region: "north_america" },
  "America/Edmonton": { country: "CA", code: "+1", region: "north_america" },
  "America/Winnipeg": { country: "CA", code: "+1", region: "north_america" },
  "America/Halifax": { country: "CA", code: "+1", region: "north_america" },
  // Europe
  "Europe/Lisbon": { country: "PT", code: "+351", region: "europe" },
  "Europe/London": { country: "GB", code: "+44", region: "europe" },
  "Europe/Madrid": { country: "ES", code: "+34", region: "europe" },
  "Europe/Paris": { country: "FR", code: "+33", region: "europe" },
  "Europe/Berlin": { country: "DE", code: "+49", region: "europe" },
  "Europe/Rome": { country: "IT", code: "+39", region: "europe" },
  "Europe/Amsterdam": { country: "NL", code: "+31", region: "europe" },
  "Europe/Zurich": { country: "CH", code: "+41", region: "europe" },
  "Europe/Dublin": { country: "IE", code: "+353", region: "europe" },
  "Europe/Brussels": { country: "BE", code: "+32", region: "europe" },
  "Europe/Vienna": { country: "AT", code: "+43", region: "europe" },
  "Europe/Warsaw": { country: "PL", code: "+48", region: "europe" },
  // Asia/Others
  "Asia/Dubai": { country: "AE", code: "+971", region: "asia" },
  "Asia/Tokyo": { country: "JP", code: "+81", region: "asia" },
  "Asia/Shanghai": { country: "CN", code: "+86", region: "asia" },
  "Asia/Kolkata": { country: "IN", code: "+91", region: "asia" },
  "Asia/Singapore": { country: "SG", code: "+65", region: "asia" },
  "Australia/Sydney": { country: "AU", code: "+61", region: "other" },
  "Australia/Melbourne": { country: "AU", code: "+61", region: "other" },
};

function detectGeoContext(): GeoContext {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = TIMEZONE_COUNTRY_MAP[tz];
    if (match) {
      return { country: match.country, countryCode: match.code, region: match.region, timezone: tz };
    }
    // Fallback: infer region from timezone prefix
    if (tz.startsWith("America/")) return { country: "XX", countryCode: "", region: "latam", timezone: tz };
    if (tz.startsWith("Europe/")) return { country: "XX", countryCode: "", region: "europe", timezone: tz };
    if (tz.startsWith("Asia/")) return { country: "XX", countryCode: "", region: "asia", timezone: tz };
    return { country: "XX", countryCode: "", region: "other", timezone: tz };
  } catch {
    return { country: "XX", countryCode: "", region: "other", timezone: "unknown" };
  }
}

interface ChatState {
  step: AgentStep;
  messages: IntakeMessage[];
  leadData: {
    id?: string;
    name?: string;
    company?: string;
    role?: string;
    email?: string;
    phone?: string;
    bottleneck?: string;
    channel?: string;
    integrations?: string;
    volume?: string;
    timeline?: string;
  };
  sessionId?: string;
  isTyping: boolean;
}

export const AgentWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAgentOpen, openAgent, closeAgent } = useRouter();
  const [hasOpened, setHasOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const geoContext = useMemo(() => detectGeoContext(), []);

  const [chatState, setChatState] = useState<ChatState>(() => {
    let sessionId = sessionStorage.getItem("aifp_session_id") || undefined;
    const lastActivity = sessionStorage.getItem("aifp_last_activity");
    const now = Date.now();

    // Se passou mais de 1 hora (3600000 ms) desde a última atividade, cria nova sessão
    if (sessionId && lastActivity && now - parseInt(lastActivity) > 3600000) {
      sessionStorage.removeItem("aifp_session_id");
      sessionStorage.removeItem("aifp_last_activity");
      sessionStorage.removeItem("watcherDisparado");
      sessionStorage.removeItem("aifp_chat_state");
      sessionId = undefined;
    }

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("aifp_session_id", sessionId);
      sessionStorage.setItem("aifp_last_activity", now.toString());
    }

    const savedState = sessionStorage.getItem("aifp_chat_state");
    if (savedState && sessionId) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.sessionId === sessionId) {
          return { ...parsed, isTyping: false }; // Reset isTyping on reload
        }
      } catch (e) {
        console.error("Failed to parse saved chat state", e);
      }
    }

    return {
      step: AgentStep.INIT,
      messages: [],
      leadData: {},
      sessionId,
      isTyping: false,
    };
  });

  useEffect(() => {
    sessionStorage.setItem("aifp_chat_state", JSON.stringify(chatState));
  }, [chatState]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages on first load or when language changes (if still on step INIT/NAME)
  useEffect(() => {
    if (
      chatState.step === AgentStep.INIT ||
      chatState.step === AgentStep.NAME
    ) {
      setChatState((prev) => ({
        ...prev,
        step: AgentStep.NAME,
        messages: [
          {
            id: "init-1",
            session_id: "temp",
            sender: "agent",
            message: t("agent.init1"),
            created_at: new Date().toISOString(),
          },
          {
            id: "init-2",
            session_id: "temp",
            sender: "agent",
            message: t("agent.init2"),
            created_at: new Date().toISOString(),
          },
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAgentOpen) scrollToBottom();
  }, [chatState.messages, isAgentOpen, chatState.isTyping]);

  // Auto-focus input after agent finishes typing
  useEffect(() => {
    if (!chatState.isTyping && isAgentOpen && chatState.step !== AgentStep.DONE) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [chatState.isTyping, isAgentOpen, chatState.step]);

  useEffect(() => {
    const handleOpenAgent = () => {
      openAgent();
      setHasOpened(true);
    };
    window.addEventListener("open-agent", handleOpenAgent);
    return () => window.removeEventListener("open-agent", handleOpenAgent);
  }, [openAgent]);

  // Simulate agent typing delay
  const simulateTyping = async (msg: string) => {
    setChatState((prev) => ({ ...prev, isTyping: true }));
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000)); // 1-2s delay

    const newMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || "temp",
      sender: "agent",
      message: msg,
      created_at: new Date().toISOString(),
    };

    // Save agent message to DB if session exists
    if (chatState.sessionId) {
      try {
        await db.saveMessage(chatState.sessionId, "agent", msg);
      } catch (e) {}
    }

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      isTyping: false,
    }));
  };

  const handleSend = async () => {
    if (!inputValue.trim() || chatState.isTyping) return;

    // Rate limiting: block if last submission was less than 2 seconds ago
    const lastSubmit = localStorage.getItem("aifp_last_submit");
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 2000) {
      console.warn(
        "Rate limit exceeded. Please wait before sending another message.",
      );
      return;
    }
    localStorage.setItem("aifp_last_submit", now.toString());
    sessionStorage.setItem("aifp_last_activity", now.toString());

    const userMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || "temp",
      sender: "user",
      message: inputValue.trim(),
      created_at: new Date().toISOString(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));

    // Save user message to DB if session exists
    if (chatState.sessionId) {
      try {
        await db.saveMessage(chatState.sessionId, "user", userMsg.message);
      } catch (e) {}
    }

    setInputValue("");

    const input = userMsg.message;

    // Detect contact info for Abandoned Cart watcher
    const emailMatch = input.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    // International phone regex: +country code + 7-15 digits (with optional separators)
    const phoneMatch = input.match(/(?:\+\d{1,4}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}\b/);

    const hasEmail = !!emailMatch;
    const hasPhone = !!phoneMatch;

    let currentLeadData = { ...chatState.leadData };
    let leadUpdated = false;

    if (emailMatch && !currentLeadData.email) {
      currentLeadData.email = emailMatch[0];
      leadUpdated = true;
    }
    if (phoneMatch && !currentLeadData.phone) {
      currentLeadData.phone = phoneMatch[0];
      leadUpdated = true;
    }

    if (leadUpdated) {
      setChatState((prev) => ({ ...prev, leadData: currentLeadData }));
    }

    // Rate limiting for lead creation: block if created less than 60 seconds ago
    const lastLeadSubmit = localStorage.getItem("aifp_last_lead_submit");
    const nowLead = Date.now();

    if (!import.meta.env.VITE_N8N_WEBHOOK_URL) {
      // Non-N8N mode: frontend creates lead + abandoned cart directly
      if ((hasEmail || hasPhone) && !currentLeadData.id) {
        if (!lastLeadSubmit || nowLead - parseInt(lastLeadSubmit) > 60000) {
          localStorage.setItem("aifp_last_lead_submit", nowLead.toString());
          try {
            const lead = await db.createLead({
              name: currentLeadData.name || "Visitante",
              email: currentLeadData.email,
              phone: currentLeadData.phone,
            });
            currentLeadData.id = lead.id;
            setChatState((prev) => ({ ...prev, leadData: currentLeadData }));

            // Create abandoned cart project immediately
            await db.createAbandonedCart(lead.id);
          } catch (e) {
            console.error("Error creating lead automatically", e);
          }
        }
      } else if (currentLeadData.id && leadUpdated) {
        // Update existing lead with new info
        try {
          const updateData: Partial<Lead> = {};
          if (currentLeadData.email) updateData.email = currentLeadData.email;
          if (currentLeadData.phone) updateData.phone = currentLeadData.phone;
          if (Object.keys(updateData).length > 0) {
            await db.updateLead(currentLeadData.id, updateData);
          }

          // Ensure they have an abandoned cart project if they don't have any project yet
          await db.createAbandonedCart(currentLeadData.id);
        } catch (e) {
          console.error("Error updating lead automatically", e);
        }
      }

      // Non-N8N mode: mark watcher as "fired" locally (no real watcher, just prevent duplicates)
      if ((hasEmail || hasPhone) && !sessionStorage.getItem("watcherDisparado")) {
        sessionStorage.setItem("watcherDisparado", "true");
      }
    }

    // Integração com n8n (Inteligência Artificial)
    // Para ativar, basta adicionar VITE_N8N_WEBHOOK_URL no seu arquivo .env
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      setChatState((prev) => ({ ...prev, isTyping: true }));
      sessionStorage.setItem('aifp_last_activity', Date.now().toString());
      try {
        // Verifica se é a primeira mensagem da sessão para o n8n
        const isNewSession = chatState.messages.filter(m => m.sender === 'user').length === 0;

        // Controla watcher — dispara apenas na 1ª detecção de contato por sessão
        // IMPORTANTE: calcular ANTES de setar o flag
        const triggerWatcher = (hasEmail || hasPhone) && !sessionStorage.getItem('watcherDisparado');
        if (triggerWatcher) {
          sessionStorage.setItem('watcherDisparado', 'true');
          console.log('[Aria] Primeiro contato detectado — criando lead + carrinho no Supabase');
        }

        // FIX: Criar lead + carrinho LOCALMENTE no Supabase antes de chamar N8N
        // N8N recebe o leadId real para automações (notificação, follow-up)
        // mas a fonte de verdade é o Supabase, não o N8N
        if (triggerWatcher && !currentLeadData.id) {
          const lastLeadSubmitN8n = localStorage.getItem("aifp_last_lead_submit");
          const nowLeadN8n = Date.now();
          if (!lastLeadSubmitN8n || nowLeadN8n - parseInt(lastLeadSubmitN8n) > 60000) {
            localStorage.setItem("aifp_last_lead_submit", nowLeadN8n.toString());
            try {
              const lead = await db.createLead({
                name: currentLeadData.name || "Visitante",
                email: currentLeadData.email,
                phone: currentLeadData.phone,
              });
              currentLeadData.id = lead.id;
              setChatState((prev) => ({ ...prev, leadData: { ...prev.leadData, id: lead.id } }));

              // Cria carrinho perdido — será removido quando intake for completo
              await db.createAbandonedCart(lead.id);
              console.log('[Aria] Lead + carrinho_perdido criados no Supabase:', lead.id);
            } catch (e) {
              console.error('[Aria] Erro ao criar lead/carrinho localmente:', e);
            }
          }
        } else if (currentLeadData.id && leadUpdated) {
          // Lead já existe — atualizar com novos dados (email/phone adicionais)
          try {
            const updateData: Record<string, string> = {};
            if (currentLeadData.email) updateData.email = currentLeadData.email;
            if (currentLeadData.phone) updateData.phone = currentLeadData.phone;
            if (Object.keys(updateData).length > 0) {
              await db.updateLead(currentLeadData.id, updateData);
            }
            // Garante que carrinho existe se ainda não tem projeto
            await db.createAbandonedCart(currentLeadData.id);
          } catch (e) {
            console.error('[Aria] Erro ao atualizar lead:', e);
          }
        }

        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: chatState.sessionId || "temp-session",
            isNewSession: isNewSession,
            triggerWatcher,
            message: input,
            language: language,
            leadData: currentLeadData,
            nome: currentLeadData.name || "",
            email: currentLeadData.email || "",
            leadId: currentLeadData.id || "",
            geo: geoContext,
          }),
        });

        const data = await response.json();
        console.log('[Aria] Resposta do N8N:', JSON.stringify(data));

        // Lê data.reply primeiro (campo retornado pelo nó Edit Fields do N8N)
        const agentReply = data.reply || data.output || data.message || data.response || "Desculpe, não consegui processar sua mensagem.";

        // Atualiza leadData se a IA retornar dados extras do lead
        if (data.nome || data.email) {
          const updates: Record<string, string> = {};
          if (data.nome && data.nome !== currentLeadData.name) {
            currentLeadData.name = data.nome;
            updates.name = data.nome;
          }
          if (data.email && data.email !== currentLeadData.email) {
            currentLeadData.email = data.email;
            updates.email = data.email;
          }
          if (Object.keys(updates).length > 0 && currentLeadData.id) {
            try {
              await db.updateLead(currentLeadData.id, updates);
            } catch (e) {}
          }
          setChatState(prev => ({
            ...prev,
            leadData: currentLeadData,
          }));
        }

        // Quando intake completo — remove carrinho abandonado e cria projeto real
        // isComplete === true é retornado pelo N8N APENAS quando Aria coleta TODOS os dados
        if (data.isComplete === true) {
          const leadId = currentLeadData.id;
          console.log('[Aria] Intake completo! leadId:', leadId, '| sessionId:', chatState.sessionId);
          if (leadId && chatState.sessionId) {
            try {
              await db.completeIntake(chatState.sessionId, { lead_id: leadId });
              console.log('[Aria] completeIntake executado — carrinho_perdido removido, entrada_lead criado');
            } catch (e) {
              console.error('[Aria] Erro ao finalizar intake:', e);
            }
          } else {
            console.warn('[Aria] isComplete=true mas sem leadId ou sessionId — completeIntake ignorado', { leadId, sessionId: chatState.sessionId });
          }
        }

        const newMsg: IntakeMessage = {
          id: Math.random().toString(),
          session_id: chatState.sessionId || "temp",
          sender: "agent",
          message: agentReply,
          created_at: new Date().toISOString(),
        };

        if (chatState.sessionId) {
          try {
            await db.saveMessage(chatState.sessionId, "agent", agentReply);
          } catch (e) {}
        }

        setChatState((prev) => ({
          ...prev,
          // FIX: define DONE quando N8N sinaliza intake completo
          step: data.isComplete === true ? AgentStep.DONE : prev.step,
          messages: [...prev.messages, newMsg],
          isTyping: false,
        }));
      } catch (error) {
        console.error("Erro ao conectar com n8n:", error);
        await simulateTyping(
          "Desculpe, estou com problemas técnicos no momento. Tente novamente mais tarde.",
        );
      }
      return; // Interrompe o fluxo fixo e usa apenas a IA
    }

    // State Machine logic (Fluxo fixo antigo caso não tenha n8n)
    const { step, leadData } = chatState;

    switch (step) {
      case AgentStep.NAME:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, name: input },
          step: AgentStep.COMPANY,
        }));
        await simulateTyping(
          t("agent.askCompany", { name: input.split(" ")[0] }),
        );
        break;

      case AgentStep.COMPANY:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, company: input },
          step: AgentStep.ROLE,
        }));
        await simulateTyping(t("agent.askRole", { company: input }));
        break;

      case AgentStep.ROLE:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, role: input },
          step: AgentStep.EMAIL,
        }));
        await simulateTyping(t("agent.askEmail"));
        break;

      case AgentStep.EMAIL:
        if (!input.includes("@")) {
          await simulateTyping(t("agent.invalidEmail"));
          return;
        }
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, email: input },
          step: AgentStep.PHONE,
        }));
        await simulateTyping(t("agent.askPhone"));
        break;

      case AgentStep.PHONE:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, phone: input },
          step: AgentStep.BOTTLENECK,
        }));

        // Rate limiting for lead creation: block if created less than 60 seconds ago
        const lastLeadSubmit = localStorage.getItem("aifp_last_lead_submit");
        const now = Date.now();
        if (lastLeadSubmit && now - parseInt(lastLeadSubmit) < 60000) {
          console.warn("Rate limit exceeded for lead creation.");
          await simulateTyping(t("agent.askBottleneck")); // Continue flow without creating duplicate lead
          break;
        }
        localStorage.setItem("aifp_last_lead_submit", now.toString());

        // In background, create lead and session since we have basic contact info now
        try {
          const lead = await db.createLead({
            name: leadData.name,
            company: leadData.company,
            role: leadData.role,
            email: leadData.email,
            phone: input,
          });
          const session = await db.createIntakeSession(lead.id);

          setChatState((prev) => ({
            ...prev,
            sessionId: session.id,
            leadData: { ...prev.leadData, id: lead.id },
          }));

          // Save the backlog of messages to the new session
          for (const m of chatState.messages) {
            await db.saveMessage(session.id, m.sender, m.message);
          }
          await db.saveMessage(session.id, "user", input); // save current input
        } catch (e) {
          console.error("Error creating lead", e);
        }

        await simulateTyping(t("agent.askBottleneck"));
        break;

      case AgentStep.BOTTLENECK:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, bottleneck: input },
          step: AgentStep.CHANNEL,
        }));
        await simulateTyping(t("agent.askChannel"));
        break;

      case AgentStep.CHANNEL:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, channel: input },
          step: AgentStep.INTEGRATIONS,
        }));
        await simulateTyping(t("agent.askIntegrations"));
        break;

      case AgentStep.INTEGRATIONS:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, integrations: input },
          step: AgentStep.VOLUME,
        }));
        await simulateTyping(t("agent.askVolume"));
        break;

      case AgentStep.VOLUME:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, volume: input },
          step: AgentStep.TIMELINE,
        }));
        await simulateTyping(t("agent.askTimeline"));
        break;

      case AgentStep.TIMELINE:
        setChatState((prev) => ({
          ...prev,
          leadData: { ...prev.leadData, timeline: input },
          step: AgentStep.DONE,
        }));

        if (chatState.sessionId) {
          try {
            await db.completeIntake(chatState.sessionId, {
              lead_id: chatState.leadData.id,
              bottleneck: chatState.leadData.bottleneck,
              channel: chatState.leadData.channel,
              integrations: chatState.leadData.integrations,
              volume: chatState.leadData.volume,
              timeline: input,
              summary: `Lead busca automação via ${chatState.leadData.channel} para resolver: ${chatState.leadData.bottleneck}. Integrações: ${chatState.leadData.integrations}. Volume: ${chatState.leadData.volume}. Prazo: ${input}.`,
            });
          } catch (e) {
            console.error("Error completing session", e);
          }
        }

        await simulateTyping(
          t("agent.done", { name: chatState.leadData.name?.split(" ")[0] }),
        );
        await simulateTyping(t("agent.goodbye"));
        break;

      case AgentStep.DONE:
        // Do nothing
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Widget Button */}
      {!isAgentOpen && (
        <button
          onClick={() => {
            openAgent();
            setHasOpened(true);
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-105 group relative"
        >
          <IconBot className="w-8 h-8" />
          {!hasOpened && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isAgentOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-brand-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-full">
                <IconBot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("agent.title")}</h3>
                <p className="text-xs text-brand-200">AI For Purpose</p>
              </div>
            </div>
            <button
              onClick={() => closeAgent()}
              className="text-white/80 hover:text-white transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar">
            {chatState.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-brand-600 text-white rounded-tr-sm"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
                  }`}
                >
                  {msg.sender === "user" ? (
                    msg.message
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:font-semibold">
                      <Markdown>{msg.message}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatState.isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-3 shadow-sm flex space-x-1 items-center h-10">
                  <div
                    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            {chatState.step !== AgentStep.DONE ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type={
                    chatState.step === AgentStep.EMAIL
                      ? "email"
                      : chatState.step === AgentStep.PHONE
                        ? "tel"
                        : "text"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={chatState.isTyping}
                  placeholder={t("agent.placeholder")}
                  className="w-full bg-slate-100 border-transparent rounded-full py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || chatState.isTyping}
                  className="absolute right-2 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors"
                >
                  <IconSend className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="text-center text-sm text-slate-500 py-2">
                {t("agent.ended")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
