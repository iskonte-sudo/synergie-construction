import React, { createContext, useContext, useState, useCallback } from 'react';

const QuoteModalContext = createContext(null);

export function QuoteModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  const openModal = useCallback((sid = null) => {
    setServiceId(sid);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ open, serviceId, openModal, closeModal, setOpen }}>
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error('useQuoteModal must be used within QuoteModalProvider');
  return ctx;
}
