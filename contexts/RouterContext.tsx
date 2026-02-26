import React, { createContext, useContext, useState } from 'react';

interface RouterContextType {
  route: string;
  navigate: (path: string) => void;
  isAgentOpen: boolean;
  openAgent: () => void;
  closeAgent: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<string>('#/');
  const [isAgentOpen, setIsAgentOpen] = useState<boolean>(false);

  const navigate = (path: string) => {
    setRoute(path);
  };

  const openAgent = () => setIsAgentOpen(true);
  const closeAgent = () => setIsAgentOpen(false);

  return (
    <RouterContext.Provider value={{ route, navigate, isAgentOpen, openAgent, closeAgent }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a RouterProvider');
  return context;
};
