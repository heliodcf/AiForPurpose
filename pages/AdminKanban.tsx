import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { db } from '../services/db';
import { ProjectStatus } from '../types';

const COLUMNS: { status: string; label: string; color: string; dot: string }[] = [
  { status: 'entrada_lead',     label: 'Entrada Lead',      color: 'border-t-blue-500',   dot: 'bg-blue-500'   },
  { status: 'Diagnóstico',      label: 'Diagnóstico',       color: 'border-t-purple-500', dot: 'bg-purple-500' },
  { status: 'Proposta',         label: 'Proposta',          color: 'border-t-yellow-500', dot: 'bg-yellow-500' },
  { status: 'Em desenvolvimento', label: 'Em Desenvolvimento', color: 'border-t-orange-500', dot: 'bg-orange-500' },
  { status: 'Entregue',         label: 'Entregue',          color: 'border-t-green-500',  dot: 'bg-green-500'  },
];

const STATUS_OPTIONS = COLUMNS.map(c => c.status);

export const AdminKanban: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    db.getProjectsWithLeads()
      .then(data => {
        // Exclude abandoned carts (shown in a separate page)
        setProjects(data.filter((p: any) => p.status !== 'carrinho_perdido'));
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setMovingId(projectId);
    try {
      await db.updateProjectStatus(projectId, newStatus as ProjectStatus);
      setProjects(prev =>
        prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMovingId(null);
    }
  };

  const getProjectsForColumn = (status: string) =>
    projects.filter(p => p.status === status);

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kanban</h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie o pipeline de projetos</p>
          </div>
          <button
            onClick={fetchProjects}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            ↻ Atualizar
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => {
              const colProjects = getProjectsForColumn(col.status);
              return (
                <div
                  key={col.status}
                  className={`flex-shrink-0 w-72 bg-slate-50 rounded-xl border-t-4 ${col.color} shadow-sm`}
                >
                  {/* Column Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                      <span className="font-semibold text-slate-700 text-sm">{col.label}</span>
                    </div>
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {colProjects.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="px-3 pb-3 space-y-3 min-h-[120px]">
                    {colProjects.length === 0 && (
                      <div className="text-center text-slate-400 text-xs py-8">
                        Nenhum projeto
                      </div>
                    )}
                    {colProjects.map(project => {
                      const lead = Array.isArray(project.lead) ? project.lead[0] : project.lead;
                      return (
                        <div
                          key={project.id}
                          className={`bg-white rounded-lg p-4 shadow-sm border border-slate-100 transition-opacity ${movingId === project.id ? 'opacity-50' : ''}`}
                        >
                          {/* Lead info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {getInitials(lead?.name || '?')}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 text-sm truncate">
                                {lead?.name || 'Sem nome'}
                              </p>
                              <p className="text-slate-500 text-xs truncate">
                                {lead?.company || lead?.email || '—'}
                              </p>
                            </div>
                          </div>

                          {/* Notes preview */}
                          {project.notes && (
                            <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                              {project.notes}
                            </p>
                          )}

                          {/* Date */}
                          <p className="text-slate-400 text-xs mb-3">
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </p>

                          {/* Move to buttons */}
                          <div className="border-t border-slate-100 pt-3">
                            <p className="text-slate-400 text-xs mb-2">Mover para:</p>
                            <div className="flex flex-wrap gap-1">
                              {STATUS_OPTIONS.filter(s => s !== col.status).map(targetStatus => {
                                const targetCol = COLUMNS.find(c => c.status === targetStatus)!;
                                return (
                                  <button
                                    key={targetStatus}
                                    onClick={() => handleStatusChange(project.id, targetStatus)}
                                    disabled={movingId === project.id}
                                    className="text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${targetCol.dot}`}></span>
                                    {targetCol.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
