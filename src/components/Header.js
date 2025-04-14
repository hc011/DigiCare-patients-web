import LogoutIcon from "@mui/icons-material/Logout"; // Import logout icon
import GetAppIcon from "@mui/icons-material/GetApp"; // Import Get App icon
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DigiCare__logo.png";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../services/authService";
import "./Header.module.css";

function Header({ closeEventSource }) {
  const isMobile = window.innerWidth <= 768;
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleLogoClick = () => {
    navigate("/patient");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAppInstallDialogClose = () => {
    setShowAppInstallDialog(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setUser(null);
      handleClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsLoggingOut(false);
  };

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
      // Show "Already installed" dialog
      setShowAppInstallDialog(true);
    } else if (deferredPrompt) {
      // Normal installation flow
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert("Installation not available right now. Please try again later.");
    }
  };

  return (
    <header>
      <img
        src={logo}
        alt="DigiCare"
        style={{ width: "150px", height: "40px" }}
        onClick={handleLogoClick}
      />

      <div className="header-buttons">
        {/* Get App Button - Always show for logged in users */}
        {user && (
          <button
            onClick={handleInstallClick}
            className="install-button header-install-button"
          >
            <span className="btn-text">Get App</span>
          </button>
        )}

        {/* Mobile Logout Button */}
        {isMobile && (
          <IconButton
            color="primary"
            onClick={handleClickOpen}
            disabled={isLoggingOut}
          >
            <LogoutIcon />
          </IconButton>
        )}

        {/* Desktop Logout Button */}
        {/* {!isMobile && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        )} */}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoggingOut}>
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="primary"
            disabled={isLoggingOut}
            autoFocus
          >
            {isLoggingOut ? <CircularProgress size={24} /> : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* App Already Installed Dialog */}
      <Dialog
        open={showAppInstallDialog}
        onClose={handleAppInstallDialogClose}
        aria-labelledby="install-dialog-title"
        aria-describedby="install-dialog-description"
      >
        <DialogTitle id="install-dialog-title">
          {"App Already Installed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="install-dialog-description">
            DigiCare is already installed on your device. You can access it from
            your home screen or app drawer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAppInstallDialogClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}

export default Header;
