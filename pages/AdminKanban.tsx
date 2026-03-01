import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { db } from '../services/db';
import { Project, ProjectStatus } from '../types';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';

const COLUMNS = [
  { id: ProjectStatus.ENTRADA_LEAD, title: 'Entrada Lead' },
  { id: ProjectStatus.PREPARACAO_QUOTE, title: 'Preparando Proposta' },
  { id: ProjectStatus.QUOTE_ENVIADA, title: 'Proposta Enviada' },
  { id: ProjectStatus.FOLLOW_UP, title: 'Follow-up' },
  { id: ProjectStatus.FECHADO_GANHO, title: 'Fechado (Ganho)' },
  { id: ProjectStatus.FECHADO_PERDIDO, title: 'Fechado (Perdido)' },
];

const SortableCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, data: { type: 'Project', project } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-brand-300 transition-colors mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{project.lead?.name || 'Sem Nome'}</h4>
        {project.probability && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {project.probability}%
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3 line-clamp-1">{project.lead?.company || 'Sem Empresa'}</p>
      
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className="font-medium text-brand-600">
          {project.estimated_value ? `R$ ${project.estimated_value.toLocaleString('pt-BR')}` : 'A definir'}
        </span>
        <span>{format(new Date(project.created_at), 'dd/MM/yyyy')}</span>
      </div>
    </div>
  );
};

export const AdminKanban: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // For Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await db.getProjectsWithLeads();
      setProjects(data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      if (error.message?.includes('relation "public.projects" does not exist') || error.message?.includes('projects')) {
        alert('A tabela "projects" não foi encontrada no Supabase. Por favor, execute o script SQL fornecido para criar a tabela do CRM Kanban.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = projects.find(p => p.id === active.id);
    if (project) setActiveProject(project);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeProject = projects.find(p => p.id === activeId);
    if (!activeProject) return;

    // Is it dropping over a column?
    const isOverColumn = COLUMNS.some(col => col.id === overId);
    
    let newStatus = activeProject.status;

    if (isOverColumn) {
      newStatus = overId as ProjectStatus;
    } else {
      // Dropping over another card
      const overProject = projects.find(p => p.id === overId);
      if (overProject) {
        newStatus = overProject.status;
      }
    }

    if (activeProject.status !== newStatus) {
      // Optimistic update
      setProjects(prev => 
        prev.map(p => p.id === activeId ? { ...p, status: newStatus } : p)
      );

      try {
        await db.updateProjectStatus(activeId, newStatus);
      } catch (error) {
        console.error('Error updating status:', error);
        // Revert on error
        fetchProjects();
      }
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await db.updateProjectDetails(selectedProject.id, {
        estimated_value: selectedProject.estimated_value,
        probability: selectedProject.probability,
        expected_close_date: selectedProject.expected_close_date,
        notes: selectedProject.notes,
      });
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Erro ao salvar detalhes.');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">CRM</h2>
        <p className="text-slate-500 mt-1">Acompanhe o pipeline de vendas e negociações.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-4 h-[calc(100vh-200px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex space-x-4 min-w-max">
              {COLUMNS.map(col => {
                const columnProjects = projects.filter(p => p.status === col.id);
                
                return (
                  <div key={col.id} className="w-80 bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100/50 rounded-t-2xl">
                      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{col.title}</h3>
                      <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full border border-slate-200">
                        {columnProjects.length}
                      </span>
                    </div>
                    
                    <div className="p-3 flex-1 overflow-y-auto">
                      <SortableContext 
                        id={col.id}
                        items={columnProjects.map(p => p.id)} 
                        strategy={verticalListSortingStrategy}
                      >
                        {columnProjects.map(project => (
                          <SortableCard 
                            key={project.id} 
                            project={project} 
                            onClick={() => setSelectedProject(project)}
                          />
                        ))}
                      </SortableContext>
                    </div>
                  </div>
                );
              })}
            </div>

            <DragOverlay>
              {activeProject ? (
                <div className="bg-white p-4 rounded-xl shadow-2xl border border-brand-300 opacity-90 cursor-grabbing w-80">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{activeProject.lead?.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{activeProject.lead?.company}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Detalhes do Negócio</h3>
              <button onClick={() => { setSelectedProject(null); setShowDeleteConfirm(false); }} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Dados do Lead</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Nome:</span> {selectedProject.lead?.name}</div>
                  <div><span className="text-slate-500">Empresa:</span> {selectedProject.lead?.company || '-'}</div>
                  <div><span className="text-slate-500">Email:</span> {selectedProject.lead?.email}</div>
                  <div><span className="text-slate-500">Telefone:</span> {selectedProject.lead?.phone || '-'}</div>
                </div>
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor Estimado (R$)</label>
                    <input
                      type="number"
                      value={selectedProject.estimated_value || ''}
                      onChange={(e) => setSelectedProject({...selectedProject, estimated_value: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Entrada</label>
                    <input
                      type="date"
                      value={format(new Date(selectedProject.created_at), 'yyyy-MM-dd')}
                      disabled
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Máxima p/ Envio da Proposta (1 dia útil)</label>
                  <input
                    type="date"
                    value={selectedProject.expected_close_date || format(new Date(new Date(selectedProject.created_at).getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedProject({...selectedProject, expected_close_date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Briefing do Agente (Gargalos, Canais, etc)</label>
                  <textarea
                    rows={6}
                    value={selectedProject.notes || `Gargalo: ${selectedProject.lead?.session?.bottleneck || 'N/A'}\nCanais: ${selectedProject.lead?.session?.channel || 'N/A'}\nIntegrações: ${selectedProject.lead?.session?.integrations || 'N/A'}\nVolume: ${selectedProject.lead?.session?.volume || 'N/A'}\nPrazo: ${selectedProject.lead?.session?.timeline || 'N/A'}`}
                    onChange={(e) => setSelectedProject({...selectedProject, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6">
                  <div className="flex space-x-2 items-center">
                    {showDeleteConfirm ? (
                      <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-lg border border-red-100">
                        <span className="text-sm text-red-700 font-medium">Excluir lead?</span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await db.deleteProject(selectedProject.id);
                              setSelectedProject(null);
                              setShowDeleteConfirm(false);
                              fetchProjects();
                            } catch (error) {
                              console.error('Error deleting project:', error);
                              alert('Erro ao excluir o lead.');
                            }
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 text-xs font-medium rounded hover:bg-slate-50"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 flex items-center"
                        title="Excluir Lead"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                    
                    {!showDeleteConfirm && selectedProject.status !== ProjectStatus.FECHADO_GANHO && selectedProject.status !== ProjectStatus.FECHADO_PERDIDO && (
                      <button 
                        type="button" 
                        onClick={async () => {
                          const currentIndex = COLUMNS.findIndex(c => c.id === selectedProject.status);
                          if (currentIndex < COLUMNS.length - 2) { // Don't auto-move to closed states
                            const nextStatus = COLUMNS[currentIndex + 1].id as ProjectStatus;
                            try {
                              await db.updateProjectStatus(selectedProject.id, nextStatus);
                              setSelectedProject(null);
                              fetchProjects();
                            } catch (error) {
                              console.error('Error moving project:', error);
                              alert('Erro ao mover o card.');
                            }
                          }
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 flex items-center space-x-2"
                      >
                        <span>Mover para Próxima Etapa</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button type="button" onClick={() => setSelectedProject(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
