/**
 * Service for handling PWA installation
 */

// Check if the app is running in standalone mode (already installed)
export const isAppInstalled = () => {
  // Check if app install state is stored in localStorage
  if (localStorage.getItem('appInstalled') === 'true') {
    return true;
  }
  
  // Check if app is running in standalone mode
  const standaloneiOS = window.navigator.standalone === true;
  const standaloneMode = window.matchMedia("(display-mode: standalone)").matches;
  return standaloneiOS || standaloneMode;
};

// Check if the app is installed using getInstalledRelatedApps API if available
export const checkInstalledRelatedApps = async () => {
  if ("getInstalledRelatedApps" in navigator) {
    try {
      const relatedApps = await navigator.getInstalledRelatedApps();
      return relatedApps.length > 0;
    } catch (error) {
      console.error("Error checking installed apps:", error);
    }
  }
  return false;
};

// Check if installation prompt is available
export const isInstallPromptAvailable = () => {
  return !!window.deferredPrompt || window.promptCaptured;
};

// Try to install the app using the global triggerAppInstall function
export const installApp = async () => {
  // First check if app is already installed
  const isStandaloneMode = isAppInstalled();
  let isDetectedAsInstalled = isStandaloneMode;
  
  if (!isDetectedAsInstalled) {
    isDetectedAsInstalled = await checkInstalledRelatedApps();
  }

  if (isDetectedAsInstalled) {
    return { success: false, message: "app_already_installed" };
  }

  // Use the global installation function if available
  if (typeof window.triggerAppInstall === 'function') {
    try {
      return await window.triggerAppInstall();
    } catch (error) {
      return error; // This will include the message from the promise rejection
    }
  } else {
    // Fallback to direct prompt usage
    const deferredPrompt = window.deferredPrompt;
    
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          window.deferredPrompt = null;
          return { success: true, message: "app_installed" };
        } else {
          return { success: false, message: "installation_rejected" };
        }
      } catch (error) {
        console.error("Error during installation:", error);
        return { success: false, message: "installation_error", error };
      }
    } else {
      return { 
        success: false, 
        message: window.promptCaptured ? "prompt_unavailable_refresh" : "no_installation_prompt" 
      };
    }
  }
};

// Get browser-specific installation instructions
export const getInstallationInstructions = () => {
  // First check if we've seen a prompt before but it's not available now
  if (window.promptCaptured && !window.deferredPrompt) {
    return "Please refresh the page and try again to install the app.";
  }

  // Otherwise give browser-specific instructions
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    return "To install DigiCare, tap the share icon and select 'Add to Home Screen'.";
  } else if (/Chrome/.test(navigator.userAgent)) {
    return "To install DigiCare, click the menu (⋮) in the top right corner and select 'Install app'.";
  } else {
    return "Installation not available right now. Please try refreshing the page or use a supported browser like Chrome.";
  }
}; 