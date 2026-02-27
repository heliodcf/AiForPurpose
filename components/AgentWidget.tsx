import React, { useState, useEffect, useRef } from 'react';
import { AgentStep, IntakeMessage } from '../types';
import { db } from '../services/db';
import { IconBot, IconX, IconSend } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

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
  const [inputValue, setInputValue] = useState('');
  
  const [chatState, setChatState] = useState<ChatState>({
    step: AgentStep.INIT,
    messages: [],
    leadData: {},
    isTyping: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatState.step === AgentStep.INIT || chatState.step === AgentStep.NAME) {
      setChatState(prev => ({
        ...prev,
        step: AgentStep.NAME,
        messages: [
          { id: 'init-1', session_id: 'temp', sender: 'agent', message: t('agent.init1'), created_at: new Date().toISOString() },
          { id: 'init-2', session_id: 'temp', sender: 'agent', message: t('agent.init2'), created_at: new Date().toISOString() }
        ]
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

  useEffect(() => {
    const handleOpenAgent = () => {
      openAgent();
      setHasOpened(true);
    };
    window.addEventListener('open-agent', handleOpenAgent);
    return () => window.removeEventListener('open-agent', handleOpenAgent);
  }, [openAgent]);

  const simulateTyping = async (msg: string) => {
    setChatState(prev => ({ ...prev, isTyping: true }));
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    const newMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || 'temp',
      sender: 'agent',
      message: msg,
      created_at: new Date().toISOString()
    };
    if (chatState.sessionId) {
      try { await db.saveMessage(chatState.sessionId, 'agent', msg); } catch(e) {}
    }
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      isTyping: false
    }));
  };

  const handleSend = async () => {
    if (!inputValue.trim() || chatState.isTyping) return;

    const lastSubmit = localStorage.getItem('aifp_last_submit');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 2000) return;
    localStorage.setItem('aifp_last_submit', now.toString());

    const userMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || 'temp',
      sender: 'user',
      message: inputValue.trim(),
      created_at: new Date().toISOString()
    };

    setChatState(prev => ({ ...prev, messages: [...prev.messages, userMsg] }));

    if (chatState.sessionId) {
      try { await db.saveMessage(chatState.sessionId, 'user', userMsg.message); } catch(e) {}
    }

    setInputValue('');
    const input = userMsg.message;

    // Integração com Aria via proxy Netlify → N8N
    setChatState(prev => ({ ...prev, isTyping: true }));
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: chatState.sessionId || 'temp-session',
          message: input,
          leadData: chatState.leadData
        })
      });

      const data = await response.json();
      const agentReply = data.reply || "Desculpe, não consegui processar sua mensagem.";
      const isComplete = data.isComplete || false;

      const newMsg: IntakeMessage = {
        id: Math.random().toString(),
        session_id: chatState.sessionId || 'temp',
        sender: 'agent',
        message: agentReply,
        created_at: new Date().toISOString()
      };

      if (chatState.sessionId) {
        try { await db.saveMessage(chatState.sessionId, 'agent', agentReply); } catch(e) {}
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, newMsg],
        isTyping: false,
        step: isComplete ? AgentStep.DONE : prev.step
      }));
    } catch (error) {
      console.error("Erro ao conectar com Aria:", error);
      await simulateTyping("Desculpe, estou com problemas técnicos no momento. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {!isAgentOpen && (
        <button
          onClick={() => { openAgent(); setHasOpened(true); }}
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

      {isAgentOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          <div className="bg-brand-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-full">
                <IconBot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('agent.title')}</h3>
                <p className="text-xs text-brand-200">AI For Purpose</p>
              </div>
            </div>
            <button onClick={() => closeAgent()} className="text-white/80 hover:text-white transition-colors">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar">
            {chatState.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
            {chatState.isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-3 shadow-sm flex space-x-1 items-center h-10">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            {chatState.step !== AgentStep.DONE ? (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={chatState.isTyping}
                  placeholder={t('agent.placeholder')}
                  className="w-full bg-slate-100 border-transparent rounded-full py-3 pl-4 pr-12 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all disabled:opacity-50"
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
                {t('agent.ended')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
