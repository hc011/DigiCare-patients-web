import React, { useState, useEffect } from "react";

const AppInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showAppInstallDialog, setShowAppInstallDialog] = useState(false);

  // Check for standalone mode
  useEffect(() => {
    const checkStandalone = () => {
      const standaloneiOS = window.navigator.standalone === true;
      const standaloneMode = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      return standaloneiOS || standaloneMode;
    };

    setIsStandalone(checkStandalone());
  }, []);

  // Check for the global deferredPrompt variable
  useEffect(() => {
    const checkPrompt = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
      }
    };

    // Initial check
    checkPrompt();

    // Set up interval to periodically check for the prompt
    const intervalId = setInterval(checkPrompt, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleInstallClick = async () => {
    // First check if app is in standalone mode
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    // Then try getInstalledRelatedApps if available
    let isDetectedAsInstalled = isStandaloneMode;
    if (!isDetectedAsInstalled && "getInstalledRelatedApps" in navigator) {
      try {
        const relatedApps = await navigator.getInstalledRelatedApps();
        isDetectedAsInstalled = relatedApps.length > 0;
      } catch (error) {
        console.error("Error checking installed apps:", error);
      }
    }

    if (isDetectedAsInstalled) {
      // App is already installed
      alert("DigiCare is already installed on your device. You can access it from your home screen or app drawer.");
    } else {
      // Check the global variable first (it might have been updated since our last check)
      const promptToUse = window.deferredPrompt || deferredPrompt;
      
      if (promptToUse) {
        try {
          promptToUse.prompt();
          const { outcome } = await promptToUse.userChoice;
          console.log(`User installation choice: ${outcome}`);
          
          if (outcome === 'accepted') {
            // Clear the prompt variables
            setDeferredPrompt(null);
            window.deferredPrompt = null;
          }
        } catch (error) {
          console.error("Error during installation:", error);
          // Provide guidance on how to install
          provideInstallationGuidance();
        }
      } else {
        // No prompt available, provide guidance
        provideInstallationGuidance();
      }
    }
  };

  const provideInstallationGuidance = () => {
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      // iOS devices
      alert("To install DigiCare, tap the share icon and select 'Add to Home Screen'.");
    } else if (/Chrome/.test(navigator.userAgent)) {
      // Chrome browser
      alert("To install DigiCare, click the menu (⋮) in the top right corner and select 'Install app'.");
    } else {
      // Generic message
      alert("Installation not available right now. Please try refreshing the page.");
    }
  };

  // Export the handleInstallClick function for use in other components
  return { handleInstallClick };
};

export default AppInstaller; 