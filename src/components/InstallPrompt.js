import React, { useState, useEffect } from "react";
import "./InstallPrompt.css";

const InstallPrompt = ({ isLoggedIn }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasPromptEventFired, setHasPromptEventFired] = useState(false);

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

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setHasPromptEventFired(true);
      // Don't automatically show the prompt here
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log("PWA was successfully installed");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isStandalone]);

  // Show prompt after login with delay
  useEffect(() => {
    let timer;

    // Only show the prompt if:
    // 1. The user is logged in
    // 2. The beforeinstallprompt event has fired (meaning the app is installable)
    // 3. Not in standalone mode
    // 4. The prompt is not already showing
    if (isLoggedIn && hasPromptEventFired && !isStandalone && !showPrompt) {
      // Delay showing the prompt (3 seconds)
      timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // 3 second delay
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoggedIn, hasPromptEventFired, isStandalone, showPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else {
      alert(
        "This is test mode. In a real environment, the browser would show the installation prompt."
      );
    }
  };

  // Don't render anything if conditions aren't met
  if (!showPrompt || isStandalone) return null;

  return (
    <div className="install-prompt">
      <button
        className="close-button"
        onClick={() => setShowPrompt(false)}
        aria-label="Close"
      >
        ×
      </button>
      <div className="install-prompt-content">
        {!deferredPrompt && <div className="test-mode-badge">Test Mode</div>}
        <h3>Add to home screen</h3>
        <p>
          For faster access and offline use.
          <br />
          <strong>No download required!</strong>
        </p>
        <div className="install-prompt-buttons">
          <button onClick={handleInstallClick} className="install-button">
            <span className="btn-text">Get App</span>
            <span className="btn-icon">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
