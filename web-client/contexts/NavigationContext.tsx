'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import { createContext, useContext, ReactNode, useState } from 'react';

interface NavigationContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { dataStorage, setStorage } = useLocalStorage();
  const [isCollapsed, setIsCollapsedState] = useState(() => {
    const storedValue = dataStorage().isCollapsed;
    return Boolean(storedValue);
  });

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    setStorage({ isCollapsed: collapsed });
  };
  return (
    <NavigationContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
