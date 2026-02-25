import React, { useState, useEffect, useRef } from 'react';
import { AgentStep, IntakeMessage } from '../types';
import { db } from '../services/db';
import { IconBot, IconX, IconSend } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

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
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [chatState, setChatState] = useState<ChatState>({
    step: AgentStep.INIT,
    messages: [],
    leadData: {},
    isTyping: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on first load or when language changes (if still on step INIT/NAME)
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
    if (isOpen) scrollToBottom();
  }, [chatState.messages, isOpen, chatState.isTyping]);

  // Simulate agent typing delay
  const simulateTyping = async (msg: string) => {
    setChatState(prev => ({ ...prev, isTyping: true }));
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000)); // 1-2s delay
    
    const newMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || 'temp',
      sender: 'agent',
      message: msg,
      created_at: new Date().toISOString()
    };
    
    // Save agent message to DB if session exists
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

    const userMsg: IntakeMessage = {
      id: Math.random().toString(),
      session_id: chatState.sessionId || 'temp',
      sender: 'user',
      message: inputValue.trim(),
      created_at: new Date().toISOString()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));
    
    // Save user message to DB if session exists
    if (chatState.sessionId) {
       try { await db.saveMessage(chatState.sessionId, 'user', userMsg.message); } catch(e) {}
    }
    
    setInputValue('');

    // State Machine logic
    const { step, leadData } = chatState;
    const input = userMsg.message;

    switch (step) {
      case AgentStep.NAME:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, name: input }, step: AgentStep.COMPANY }));
        await simulateTyping(t('agent.askCompany', { name: input.split(' ')[0] }));
        break;
      
      case AgentStep.COMPANY:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, company: input }, step: AgentStep.ROLE }));
        await simulateTyping(t('agent.askRole', { company: input }));
        break;

      case AgentStep.ROLE:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, role: input }, step: AgentStep.EMAIL }));
        await simulateTyping(t('agent.askEmail'));
        break;
        
      case AgentStep.EMAIL:
        if (!input.includes('@')) {
          await simulateTyping(t('agent.invalidEmail'));
          return;
        }
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, email: input }, step: AgentStep.PHONE }));
        await simulateTyping(t('agent.askPhone'));
        break;

      case AgentStep.PHONE:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, phone: input }, step: AgentStep.BOTTLENECK }));
        
        // In background, create lead and session since we have basic contact info now
        try {
          const lead = await db.createLead({ 
            name: leadData.name, 
            company: leadData.company, 
            role: leadData.role,
            email: leadData.email,
            phone: input
          });
          const session = await db.createIntakeSession(lead.id);
          
          setChatState(prev => ({ 
            ...prev, 
            sessionId: session.id,
            leadData: { ...prev.leadData, id: lead.id } 
          }));
          
          // Save the backlog of messages to the new session
          for (const m of chatState.messages) {
             await db.saveMessage(session.id, m.sender, m.message);
          }
          await db.saveMessage(session.id, 'user', input); // save current input
        } catch (e) { console.error('Error creating lead', e) }

        await simulateTyping(t('agent.askBottleneck'));
        break;

      case AgentStep.BOTTLENECK:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, bottleneck: input }, step: AgentStep.CHANNEL }));
        await simulateTyping(t('agent.askChannel'));
        break;

      case AgentStep.CHANNEL:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, channel: input }, step: AgentStep.INTEGRATIONS }));
        await simulateTyping(t('agent.askIntegrations'));
        break;

      case AgentStep.INTEGRATIONS:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, integrations: input }, step: AgentStep.VOLUME }));
        await simulateTyping(t('agent.askVolume'));
        break;

      case AgentStep.VOLUME:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, volume: input }, step: AgentStep.TIMELINE }));
        await simulateTyping(t('agent.askTimeline'));
        break;

      case AgentStep.TIMELINE:
        setChatState(prev => ({ ...prev, leadData: { ...prev.leadData, timeline: input }, step: AgentStep.DONE }));
        
        if (chatState.sessionId) {
          try {
            await db.completeIntake(chatState.sessionId, {
              lead_id: chatState.leadData.id,
              bottleneck: chatState.leadData.bottleneck,
              channel: chatState.leadData.channel,
              integrations: chatState.leadData.integrations,
              volume: chatState.leadData.volume,
              timeline: input,
              summary: `Lead busca automação via ${chatState.leadData.channel} para resolver: ${chatState.leadData.bottleneck}. Integrações: ${chatState.leadData.integrations}. Volume: ${chatState.leadData.volume}. Prazo: ${input}.`
            });
          } catch (e) { console.error('Error completing session', e) }
        }

        await simulateTyping(t('agent.done', { name: chatState.leadData.name?.split(' ')[0] }));
        await simulateTyping(t('agent.goodbye'));
        break;

      case AgentStep.DONE:
        // Do nothing
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Widget Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setHasOpened(true); }}
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
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Header */}
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
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
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

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            {chatState.step !== AgentStep.DONE ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type={chatState.step === AgentStep.EMAIL ? "email" : chatState.step === AgentStep.PHONE ? "tel" : "text"}
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