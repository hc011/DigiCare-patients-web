import React, { useState, useEffect } from "react";
import "./InstallPrompt.css";

const InstallPrompt = ({ isLoggedIn }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasPromptEventFired, setHasPromptEventFired] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);
  // Track the nextPromptTime in state to trigger re-renders
  const [nextPromptTime, setNextPromptTime] = useState(() => {
    return parseInt(localStorage.getItem("nextPromptTime") || "0");
  });

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
      if ("getInstalledRelatedApps" in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          if (relatedApps.length > 0) {
            // PWA is installed, permanently dismiss prompt
            setUserDismissed(true);
            localStorage.setItem("installPromptDismissed", "true");
          }
        } catch (error) {
          console.error("Error checking installed apps:", error);
        }
      }
    }

    checkInstalledApps();
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (isStandalone) return;

    const handler = (e) => {
      console.log("beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e);
      setHasPromptEventFired(true);
      // Don't automatically show the prompt here
    };

    const handleAppInstalled = () => {
      console.log("appinstalled event fired!");
      setShowPrompt(false);
      setDeferredPrompt(null);
      // When app is installed, permanently dismiss
      setUserDismissed(true);
      localStorage.setItem("installPromptDismissed", "true");
      console.log("PWA was successfully installed");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isStandalone]);

  // Check on component mount if we need to show the prompt based on prior dismissals
  useEffect(() => {
    // Check if user permanently dismissed the prompt
    const permanentlyDismissed =
      localStorage.getItem("installPromptDismissed") === "true";
    if (permanentlyDismissed) {
      setUserDismissed(true);
      return;
    }

    // Check if there's a next prompt time stored
    const storedNextPromptTime = localStorage.getItem("nextPromptTime");
    if (storedNextPromptTime) {
      setNextPromptTime(parseInt(storedNextPromptTime));
    }
  }, []);

  // Use an interval to periodically check if it's time to show the prompt
  useEffect(() => {
    // Don't set up interval if permanently dismissed or already showing
    if (userDismissed || showPrompt || !hasPromptEventFired || !isLoggedIn) {
      return;
    }

    console.log("Setting up interval to check next prompt time");
    const checkTime = setInterval(() => {
      const now = Date.now();
      const storedTime = parseInt(
        localStorage.getItem("nextPromptTime") || "0"
      );

      console.log(
        `Checking time: current=${now}, nextPrompt=${storedTime}, diff=${
          now - storedTime
        }ms`
      );

      if (storedTime > 0 && now >= storedTime) {
        console.log("Time to show prompt again!");
        localStorage.removeItem("nextPromptTime");
        setNextPromptTime(0);
        setShowPrompt(true);
        clearInterval(checkTime);
      }
    }, 1000); // Check every second

    return () => clearInterval(checkTime);
  }, [userDismissed, showPrompt, hasPromptEventFired, isLoggedIn]);

  // Show prompt after login with delay or based on dismissal timing
  useEffect(() => {
    let timer;

    // Add debugging to identify why prompt isn't showing
    console.log("InstallPrompt conditions:", {
      isLoggedIn,
      hasPromptEventFired,
      isStandalone,
      showPrompt,
      userDismissed,
      nextPromptTime: localStorage.getItem("nextPromptTime"),
      isPastNextPromptTime:
        !localStorage.getItem("nextPromptTime") ||
        Date.now() > parseInt(localStorage.getItem("nextPromptTime") || "0"),
      installPromptDismissed:
        localStorage.getItem("installPromptDismissed") === "true",
      dismissCount: localStorage.getItem("dismissCount") || "0",
    });

    // Only show the prompt if:
    // 1. The user is logged in
    // 2. The beforeinstallprompt event has fired (meaning the app is installable)
    // 3. Not in standalone mode (not already installed)
    // 4. The prompt is not already showing
    // 5. The user hasn't permanently dismissed the prompt
    // 6. There's no next prompt time set, or the time has passed
    const storedNextPromptTime = localStorage.getItem("nextPromptTime");
    const canShowPrompt =
      isLoggedIn &&
      hasPromptEventFired &&
      !isStandalone &&
      !showPrompt &&
      !userDismissed &&
      (!storedNextPromptTime || Date.now() > parseInt(storedNextPromptTime));

    if (canShowPrompt) {
      console.log("Setting timer to show prompt after delay");
      // Delay showing the prompt (3 seconds)
      timer = setTimeout(() => {
        console.log("Timer expired, showing prompt");
        setShowPrompt(true);
      }, 3000); // 3 second delay
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    isLoggedIn,
    hasPromptEventFired,
    isStandalone,
    showPrompt,
    userDismissed,
    nextPromptTime,
  ]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
        // Permanently dismiss on successful installation
        setUserDismissed(true);
        localStorage.setItem("installPromptDismissed", "true");
      }
    } else {
      alert(
        "This is test mode. In a real environment, the browser would show the installation prompt."
      );
    }
  };

  const handleClosePrompt = () => {
    console.log("User dismissed the prompt");
    setShowPrompt(false);

    // Get current dismissal count
    const dismissCount =
      parseInt(localStorage.getItem("dismissCount") || "0") + 1;
    localStorage.setItem("dismissCount", dismissCount);

    let nextDelay;
    // Set next delay based on dismissal count
    if (dismissCount === 1) {
      nextDelay = 10 * 1000; // 10 seconds
      console.log("First dismissal - will show again in 10 seconds");
    } else if (dismissCount === 2) {
      nextDelay = 20 * 1000; // 20 seconds
      console.log("Second dismissal - will show again in 20 seconds");
    } else if (dismissCount === 3) {
      nextDelay = 60 * 1000; // 1 minute
      console.log("Third dismissal - will show again in 1 minute");
    } else {
      // After 3 dismissals, permanently dismiss
      console.log("Fourth dismissal - permanently dismissing");
      setUserDismissed(true);
      localStorage.setItem("installPromptDismissed", "true");
      return;
    }

    // Set the next time to show the prompt
    const newNextPromptTime = Date.now() + nextDelay;
    console.log(
      `Setting next prompt time: ${new Date(
        newNextPromptTime
      ).toLocaleTimeString()}`
    );
    localStorage.setItem("nextPromptTime", newNextPromptTime);
    setNextPromptTime(newNextPromptTime);
  };

  // Don't render anything if conditions aren't met
  if (!showPrompt || isStandalone) return null;

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
