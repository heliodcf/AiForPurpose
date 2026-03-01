import React, { useState } from 'react';
import { IconLayoutDashboard, IconUsers, IconFolder, IconMenu } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { route: currentHash, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${mobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800 justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">AI</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Workspace</span>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <a 
            href="#/admin" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#/admin'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentHash === '#/admin' || currentHash === '#/admin/' ? 'bg-brand-600/10 text-brand-400 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <IconLayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </a>
          <a 
            href="#/admin/leads" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#/admin/leads'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentHash === '#/admin/leads' ? 'bg-brand-600/10 text-brand-400 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <IconUsers className="w-5 h-5" />
            <span>Leads & Intakes</span>
          </a>
          <a 
            href="#/admin/kanban" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#/admin/kanban'); }} 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentHash === '#/admin/kanban' ? 'bg-brand-600/10 text-brand-400 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <IconFolder className="w-5 h-5" />
            <span>CRM Kanban</span>
          </a>
          <a 
            href="#/admin/users" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#/admin/users'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentHash === '#/admin/users' ? 'bg-brand-600/10 text-brand-400 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>Usuários Admin</span>
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
           <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Sair</span>
          </button>
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#/'); }} 
            className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Voltar ao site</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center md:hidden">
            <button 
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <IconMenu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg ml-4">AI Workspace</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
            </div>
            <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm border border-brand-200">
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <button onClick={logout} className="md:hidden text-slate-500 p-2">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
