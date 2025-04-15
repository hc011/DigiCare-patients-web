import React, { useState, useEffect } from "react";
import "./InstallPrompt.css";

const InstallPrompt = ({ isLoggedIn }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasPromptEventFired, setHasPromptEventFired] = useState(false);
  const [tempDismissed, setTempDismissed] = useState(false);
  // Track the nextPromptTime in state to trigger re-renders
  const [nextPromptTime, setNextPromptTime] = useState(() => {
    return parseInt(localStorage.getItem("nextPromptTime") || "0");
  });
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);

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

  // Check if the app is already installed using getInstalledRelatedApps if available
  useEffect(() => {
    async function checkInstalledApps() {
      // First check standalone mode
      if (isStandalone) {
        setIsAlreadyInstalled(true);
        return;
      }

      // Then check getInstalledRelatedApps if available
      if ("getInstalledRelatedApps" in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          if (relatedApps.length > 0) {
            setIsAlreadyInstalled(true);
          }
        } catch (error) {
          console.error("Error checking installed apps:", error);
        }
      }
    }

    checkInstalledApps();
  }, [isStandalone]);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setHasPromptEventFired(true);
      // Don't automatically show the prompt here
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsAlreadyInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Check if there's a next prompt time stored
  useEffect(() => {
    const storedNextPromptTime = localStorage.getItem("nextPromptTime");
    if (storedNextPromptTime) {
      setNextPromptTime(parseInt(storedNextPromptTime));

      // Check if we're still in the temporary dismissal period
      if (Date.now() < parseInt(storedNextPromptTime)) {
        setTempDismissed(true);
      }
    }
  }, []);

  // Use an interval to periodically check if it's time to show the prompt
  useEffect(() => {
    // Don't set up interval if already showing, already installed, or no prompt event
    if (
      showPrompt ||
      isAlreadyInstalled ||
      !hasPromptEventFired ||
      !isLoggedIn
    ) {
      return;
    }

    const checkTime = setInterval(() => {
      const now = Date.now();
      const storedTime = parseInt(
        localStorage.getItem("nextPromptTime") || "0"
      );

      if (storedTime > 0 && now >= storedTime) {
        localStorage.removeItem("nextPromptTime");
        setNextPromptTime(0);
        setTempDismissed(false);
        setShowPrompt(true);
        clearInterval(checkTime);
      }
    }, 1000); // Check every second

    return () => clearInterval(checkTime);
  }, [showPrompt, isAlreadyInstalled, hasPromptEventFired, isLoggedIn]);

  // Show prompt after login with delay or based on dismissal timing
  useEffect(() => {
    let timer;

    // Only show the prompt if:
    // 1. The user is logged in
    // 2. The beforeinstallprompt event has fired (meaning the app is installable)
    // 3. Not already installed
    // 4. The prompt is not already showing
    // 5. Not temporarily dismissed
    // 6. There's no next prompt time set, or the time has passed
    const storedNextPromptTime = localStorage.getItem("nextPromptTime");
    const canShowPrompt =
      isLoggedIn &&
      hasPromptEventFired &&
      !isAlreadyInstalled &&
      !isStandalone &&
      !showPrompt &&
      !tempDismissed &&
      (!storedNextPromptTime || Date.now() > parseInt(storedNextPromptTime));

    if (canShowPrompt) {
      // Delay showing the prompt (2 minutes)
      timer = setTimeout(() => {
        setShowPrompt(true);
      }, 120000); // 2 minute delay
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    isLoggedIn,
    hasPromptEventFired,
    isAlreadyInstalled,
    isStandalone,
    showPrompt,
    tempDismissed,
    nextPromptTime,
  ]);

  const handleInstallClick = async () => {
    // Check again if already installed
    const isStandaloneMode =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

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
      alert(
        "DigiCare is already installed on your device. You can access it from your home screen or app drawer."
      );
      setShowPrompt(false);
      setIsAlreadyInstalled(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
        setIsAlreadyInstalled(true);
      }
    } else {
      alert(
        "This is test mode. In a real environment, the browser would show the installation prompt."
      );
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    setTempDismissed(true);

    // Set next prompt time to 24 hours from now
    const newNextPromptTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem("nextPromptTime", newNextPromptTime);
    setNextPromptTime(newNextPromptTime);
  };

  // Don't render anything if conditions aren't met
  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <button
        className="close-button"
        onClick={handleClosePrompt}
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
          <strong>No download required from playstore!</strong>
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
