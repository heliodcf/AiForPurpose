import React, { useEffect } from "react";
import { LandingPage } from "./pages/Landing";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLeads } from "./pages/AdminLeads";
import { AdminKanban } from "./pages/AdminKanban";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminAbandonedCarts } from "./pages/AdminAbandonedCarts";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RouterProvider, useRouter } from "./contexts/RouterContext";

import { ErrorBoundary } from "./components/ErrorBoundary";

const AppContent: React.FC = () => {
  const { route } = useRouter();
  const { language } = useLanguage();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Atualiza o título dinamicamente baseado na rota/idioma
    if (route.startsWith("#/admin")) {
      document.title = "Admin | AI For Purpose";
    } else {
      document.title =
        language === "en"
          ? "AI For Purpose | Purpose-Driven Automation"
          : "AI For Purpose | Automação com Propósito";
    }
  }, [route, language]);

  // Rotas Protegidas do Admin
  if (route.startsWith("#/admin")) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          Carregando...
        </div>
      );
    }

    if (!user) {
      return <AdminLogin />;
    }

    if (route === "#/admin/leads") {
      return <AdminLeads />;
    }

    if (route === "#/admin/kanban") {
      return <AdminKanban />;
    }

    if (route === "#/admin/users") {
      return <AdminUsers />;
    }

    if (route === "#/admin/abandoned-carts") {
      return <AdminAbandonedCarts />;
    }

    return <AdminDashboard />;
  }

  // Rota Padrão (Landing)
  return <LandingPage />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <RouterProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </RouterProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
