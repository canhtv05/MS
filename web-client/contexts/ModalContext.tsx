import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ModalContextType {
  modalStack: string[];
  openModal: (modal: string) => void;
  closeTopModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalStack, setModalStack] = useState<string[]>([]);

  const openModal = (modal: string) => {
    setModalStack([...modalStack, modal]);
  };

  const closeTopModal = useCallback(() => {
    const topModal = modalStack[modalStack.length - 1];
    if (!topModal) return;
    document.dispatchEvent(new CustomEvent(`close-modal:${topModal}`));
    setModalStack(modalStack.slice(0, -1));
  }, [modalStack]);

  const closeAllModals = useCallback(() => {
    const stack = [...modalStack];
    for (let i = stack.length - 1; i >= 0; i--) {
      document.dispatchEvent(new CustomEvent(`close-modal:${stack[i]}`));
    }
    setModalStack([]);
  }, [modalStack]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTopModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeTopModal]);

  return (
    <ModalContext.Provider value={{ modalStack, openModal, closeTopModal, closeAllModals }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
