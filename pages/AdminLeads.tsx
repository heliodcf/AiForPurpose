import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { db } from '../services/db';
import { Alert } from '../components/Alert';
import { ChannelType } from '../types';

// Configuração de estimativas por canal
const CHANNEL_ESTIMATES: Record<string, { channel: string; icon: string; setup: string; mensal: string; keywords: string[] }> = {
  [ChannelType.WHATSAPP]: { channel: 'WhatsApp', icon: '💬', setup: 'R$ 2.500 - R$ 4.000', mensal: 'R$ 497/mês', keywords: ['whats', 'wpp', 'whatsapp'] },
  [ChannelType.INSTAGRAM]: { channel: 'Instagram', icon: '📸', setup: 'R$ 2.000 - R$ 3.500', mensal: 'R$ 397/mês', keywords: ['insta', 'ig', 'instagram'] },
  [ChannelType.WEB]: { channel: 'Site (Widget)', icon: '🌐', setup: 'R$ 1.500 - R$ 3.000', mensal: 'R$ 297/mês', keywords: ['site', 'web', 'widget'] },
  [ChannelType.VOICE]: { channel: 'Voz (URA IA)', icon: '🎙️', setup: 'R$ 5.000 - R$ 8.000', mensal: 'R$ 997/mês', keywords: ['voz', 'telefone', 'call', 'phone', 'ura'] },
  [ChannelType.TELEGRAM]: { channel: 'Telegram', icon: '✈️', setup: 'R$ 1.500 - R$ 2.500', mensal: 'R$ 297/mês', keywords: ['telegram'] },
};

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const fetchLeads = (currentPage: number) => {
    setLoading(true);
    db.getLeadsWithDetails(currentPage, limit)
      .then(response => {
        setLeads(response.data);
        setTotalCount(response.totalCount);
        setError(null);
      })
      .catch(err => {
        console.error("Erro ao buscar leads: Verifique as credenciais do Supabase.", err);
        setError("Não foi possível carregar a lista de leads. Verifique sua conexão ou configuração do banco de dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  // Lógica para deduzir o orçamento baseado na resposta de canal
  const getEstimates = (channelText?: string) => {
    if (!channelText) return [];
    const text = channelText.toLowerCase();
    const estimates = [];

    // Busca por palavras-chave mapeadas na configuração
    for (const [key, config] of Object.entries(CHANNEL_ESTIMATES)) {
      if (config.keywords.some(keyword => text.includes(keyword))) {
        estimates.push({ channel: config.channel, icon: config.icon, setup: config.setup, mensal: config.mensal });
      }
    }

    // Fallback se não detectar nenhum específico mas houver texto
    if (estimates.length === 0 && text.trim().length > 0) {
      estimates.push({ channel: 'Integração Customizada', icon: '⚙️', setup: 'Sob Análise', mensal: 'Sob Análise' });
    }

    return estimates;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Leads & Intakes</h2>
          <p className="text-slate-500 mt-1">Gerencie os contatos e briefings captados pelo Agente.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>Exportar CSV</span>
        </button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p>Nenhum lead encontrado.</p>
            <p className="text-sm mt-1">Teste o widget na landing page para ver os dados aqui ou verifique suas chaves de API!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Contato</th>
                  <th className="px-6 py-4 font-semibold">Empresa / Cargo</th>
                  <th className="px-6 py-4 font-semibold">Canais Solicitados</th>
                  <th className="px-6 py-4 font-semibold">Gargalo / Objetivo</th>
                  <th className="px-6 py-4 font-semibold">Status Intake</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-slate-500 text-xs">{lead.email}</div>
                      {lead.phone && <div className="text-slate-500 text-xs mt-0.5">{lead.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{lead.company || '-'}</div>
                      <div className="text-slate-500 text-xs">{lead.role || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {lead.session?.channel ? (
                        <div className="flex flex-wrap gap-1">
                          {getEstimates(lead.session.channel).map((est, i) => (
                             <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs border border-slate-200 whitespace-nowrap" title={lead.session.channel}>
                               {est.icon} {est.channel}
                             </span>
                          ))}
                          {getEstimates(lead.session.channel).length === 0 && (
                            <span className="text-xs text-slate-400 truncate max-w-[100px] block" title={lead.session.channel}>{lead.session.channel}</span>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-[200px] truncate" title={lead.session?.bottleneck}>
                      {lead.session?.bottleneck || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {lead.session?.completed_at ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Finalizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Em andamento
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-brand-600 hover:text-brand-800 font-medium bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center"
                        onClick={() => setSelectedLead(lead)}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && leads.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{(page - 1) * limit + 1}</span> a <span className="font-medium">{Math.min(page * limit, totalCount)}</span> de <span className="font-medium">{totalCount}</span> leads
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <div className="text-sm text-slate-600 font-medium px-2">
              Página {page} de {totalPages || 1}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {selectedLead.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                  <p className="text-sm text-slate-500">{selectedLead.company || 'Empresa não informada'} {selectedLead.role ? `• ${selectedLead.role}` : ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Coluna Esquerda: Dados do Contato e Briefing */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informações de Contato</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <svg className="w-4 h-4 mr-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {selectedLead.email}
                      </div>
                      {selectedLead.phone && (
                        <div className="flex items-center text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <svg className="w-4 h-4 mr-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {selectedLead.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedLead.session && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Briefing do Agente</h4>
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Gargalo / Objetivo</p>
                          <p className="text-sm text-slate-800">{selectedLead.session.bottleneck || 'Não informado'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Canais Desejados</p>
                          <p className="text-sm text-slate-800">{selectedLead.session.channel || 'Não informado'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 mb-1 font-medium">Integrações Necessárias</p>
                          <p className="text-sm text-slate-800">{selectedLead.session.integrations || 'Não informado'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Volume</p>
                            <p className="text-sm text-slate-800">{selectedLead.session.volume || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1 font-medium">Prazo</p>
                            <p className="text-sm text-slate-800">{selectedLead.session.timeline || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna Direita: Estimativa de Orçamento Automática */}
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 relative flex flex-col">
                  <div className="absolute top-4 right-4">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                        IA Estimator
                     </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-brand-900 mb-2">Proposta Estimada</h4>
                  <p className="text-sm text-brand-700 mb-6">Orçamento gerado automaticamente com base nos canais e requisitos mapeados durante o intake.</p>

                  <div className="flex-1 space-y-4">
                    {selectedLead.session?.channel && getEstimates(selectedLead.session.channel).length > 0 ? (
                      getEstimates(selectedLead.session.channel).map((est, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{est.icon}</div>
                            <div>
                              <p className="font-bold text-slate-800">{est.channel}</p>
                              <p className="text-xs text-slate-500">Automação Nativa</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">Setup: <span className="text-brand-600">{est.setup}</span></p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{est.mensal}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-6 rounded-xl border border-brand-200 text-center">
                         <p className="text-sm text-slate-500">Canais não identificados no texto. A avaliação deverá ser feita manualmente.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-brand-200">
                     <button className="w-full bg-brand-600 text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:bg-brand-700 transition-colors flex justify-center items-center space-x-2">
                       <span>Gerar PDF Comercial</span>
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </button>
                     <p className="text-xs text-center text-brand-600 mt-3">* O PDF incluirá termos, integrações citadas ({selectedLead.session?.integrations || 'Nenhuma'}) e valores finais.</p>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}

    </AdminLayout>
  );
};