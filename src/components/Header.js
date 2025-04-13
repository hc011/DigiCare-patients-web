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
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isStandalone]);

  const handleLogoClick = () => {
    navigate("/patient");
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        // Store in localStorage that app was installed
        localStorage.setItem("installPromptDismissed", "true");
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
        {/* Get App Button - Only show if not standalone and the user is logged in */}
        {!isStandalone && user && (
          <button
            onClick={handleInstallClick}
            className="install-button header-install-button"
          >
            <span className="btn-text">Get App</span>
          </button>
        )}

        {/* Mobile Logout Button */}
        {/* {isMobile && (
          <IconButton
            color="primary"
            onClick={handleClickOpen}
            disabled={isLoggingOut}
          >
            <LogoutIcon />
          </IconButton>
        )} */}

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
    </header>
  );
}

export default Header;
