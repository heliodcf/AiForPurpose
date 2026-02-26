import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { db } from '../services/db';
import { Alert } from '../components/Alert';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalLeads: 0, activeProjects: 0, completedIntakes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.getDashboardStats()
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(err => {
        console.error("Erro ao buscar estatísticas.", err);
        setError("Não foi possível carregar as estatísticas. Verifique sua conexão ou configuração do banco de dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
        <p className="text-slate-500 mt-1">Acompanhe as métricas de conversão e projetos ativos.</p>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 h-32 bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 h-32 bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 h-32 bg-slate-200 rounded-2xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Leads</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalLeads}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Intakes Finalizados</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.completedIntakes}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Projetos Ativos</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.activeProjects}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Mock Chart Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">Conversão por Canal (Mock)</h3>
        <div className="h-64 flex items-end space-x-4">
          <div className="w-full bg-slate-100 rounded-t-lg relative group">
            <div className="absolute bottom-0 w-full bg-brand-400 rounded-t-lg transition-all" style={{ height: '60%' }}></div>
            <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">WhatsApp</div>
          </div>
          <div className="w-full bg-slate-100 rounded-t-lg relative">
             <div className="absolute bottom-0 w-full bg-brand-500 rounded-t-lg transition-all" style={{ height: '85%' }}></div>
             <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">Voz</div>
          </div>
          <div className="w-full bg-slate-100 rounded-t-lg relative">
             <div className="absolute bottom-0 w-full bg-brand-300 rounded-t-lg transition-all" style={{ height: '40%' }}></div>
             <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">Site</div>
          </div>
          <div className="w-full bg-slate-100 rounded-t-lg relative">
             <div className="absolute bottom-0 w-full bg-brand-200 rounded-t-lg transition-all" style={{ height: '20%' }}></div>
             <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">Instagram</div>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
};