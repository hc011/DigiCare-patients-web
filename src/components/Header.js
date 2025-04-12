import LogoutIcon from "@mui/icons-material/Logout"; // Import logout icon
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
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DigiCare__logo.png";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../services/authService";
import "./Header.module.css";

function Header({ closeEventSource }) {
  const isMobile = window.innerWidth <= 768;
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsLoggingOut(false);
  };

  return (
    <header>
      <img
        src={logo}
        alt="DigiCare"
        style={{ width: "150px", height: "40px" }}
        onClick={handleLogoClick}
      />

      {/* Mobile Logout Button - Commented out 
      {isMobile && (
        <IconButton
          color="primary"
          onClick={handleClickOpen}
          sx={{ marginLeft: "auto" }}
          disabled={isLoggingOut}
        >
          <LogoutIcon />
        </IconButton>
      )}
      */}

      {/* Desktop Logout Button - Commented out
      {!isMobile && (
        <div className="logout-button">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClickOpen}
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        </div>
      )}
      */}

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
