import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { db } from '../services/db';
import { Alert } from '../components/Alert';

export const AdminAbandonedCarts: React.FC = () => {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recoveringId, setRecoveringId] = useState<string | null>(null);

  const fetchCarts = () => {
    setLoading(true);
    db.getAbandonedCarts()
      .then(data => {
        setCarts(data);
        setError(null);
      })
      .catch(err => {
        console.error('Erro ao buscar carrinhos abandonados:', err);
        setError('Não foi possível carregar os carrinhos abandonados. Verifique sua conexão.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleRecover = async (projectId: string, leadName: string) => {
    setRecoveringId(projectId);
    try {
      await db.recoverLead(projectId);
      setSuccess(`Lead "${leadName}" recuperado com sucesso e movido para o pipeline.`);
      // Remove da lista local
      setCarts(prev => prev.filter(c => c.id !== projectId));
    } catch (err: any) {
      setError(`Erro ao recuperar lead: ${err.message}`);
    } finally {
      setRecoveringId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Carrinhos Abandonados</h2>
          <p className="text-slate-500 mt-1">Leads que iniciaram o widget mas não completaram o briefing.</p>
        </div>
        <button
          onClick={fetchCarts}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Atualizar</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="font-medium">Nenhum carrinho abandonado no momento.</p>
            <p className="text-sm mt-1">Todos os leads iniciados completaram o briefing ou foram recuperados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Lead</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Telefone</th>
                  <th className="px-6 py-4 font-semibold">Abandonado em</th>
                  <th className="px-6 py-4 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {(cart.lead?.name || '?').substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">
                          {cart.lead?.name || 'Desconhecido'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cart.lead?.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cart.lead?.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDate(cart.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRecover(cart.id, cart.lead?.name || 'Lead')}
                        disabled={recoveringId === cart.id}
                        className="inline-flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                      >
                        {recoveringId === cart.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-emerald-600"></div>
                            <span>Recuperando...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Recuperar Lead</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && carts.length > 0 && (
        <div className="mt-4 text-sm text-slate-500">
          <span className="font-medium text-amber-600">{carts.length}</span> carrinho{carts.length !== 1 ? 's' : ''} abandonado{carts.length !== 1 ? 's' : ''} aguardando recuperação.
        </div>
      )}
    </AdminLayout>
  );
};
