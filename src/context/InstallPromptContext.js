import React, { createContext, useState, useContext, useEffect } from 'react';

export const InstallPromptContext = createContext();

export const InstallPromptProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [hasPromptEventFired, setHasPromptEventFired] = useState(false);

  // Listen for beforeinstallprompt event at the provider level
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setHasPromptEventFired(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setHasPromptEventFired(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const value = {
    deferredPrompt,
    setDeferredPrompt,
    hasPromptEventFired,
    setHasPromptEventFired
  };

  return (
    <InstallPromptContext.Provider value={value}>
      {children}
    </InstallPromptContext.Provider>
  );
};

export const useInstallPrompt = () => {
  const context = useContext(InstallPromptContext);
  if (context === undefined) {
    throw new Error('useInstallPrompt must be used within an InstallPromptProvider');
  }
  return context;
}; 