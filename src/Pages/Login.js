import LockIcon from "@mui/icons-material/Lock";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserDetailForm from "../patient-demo/UserDetailForm";
import { login as loginService } from "../services/authService";
import { updateUser } from "../services/api";

import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [isMoBNum, setIsMobNum] = useState(false);
  const navigate = useNavigate();
  const [showUserDetailForm, setShowUserDetailForm] = useState(false);
  const [userData, setUserData] = useState(null);

  const [credential, setCredential] = useState({
    mobileNumber: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleClickToGetOtp = async () => {
    if (!credential.mobileNumber) {
      setSnackbar({
        open: true,
        message: "Please enter your mobile number",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      //await sendOtp(credential.mobileNumber);
      setIsMobNum(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send OTP. Try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setIsMobNum(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredential((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginService(credential.mobileNumber, credential.password);
      console.log('User object:', data.user);
      
      // Store the user data and appointments list in local storage
      localStorage.setItem("user", JSON.stringify(data));
      
      if (data.user && data.user.created_user === true) {
        console.log('User needs to complete registration');
        setUserData(data);
        navigate('/register', { state: { userData: data } });
      } else {
        console.log('User already registered, proceeding to patient home');
        setUser(data);
        navigate("/patient", { state: { freshLogin: true } }, { replace: true });
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid credentials";
            break;
          case 403:
            errorMessage = "Account locked";
            break;
          case 500:
            errorMessage = "Server error";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error";
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailSubmit = async (formData) => {
    setLoading(true);
    try {
      // Prepare payload for the updateUser API
      const updatePayload = {
        first_name: formData.firstName || "",
        last_name: formData.lastName || "Chauhan",
        email: formData.email || "",
        password: formData.password || "123456789"
      };
      
      // Call the updateUser API
      const response = await updateUser(updatePayload);
      console.log("User update response:", response);
      
      // Update the user data with the form information
      const updatedUserData = {
        ...userData,
        user: {
          ...userData.user,
          ...formData
        }
      };

      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      setShowUserDetailForm(false);
      navigate("/patient", { state: { freshLogin: true } }, { replace: true });
    } catch (error) {
      console.error("Error updating user details:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-background">
      <div className="desktop-content">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1976d2",
            mt: 4,
            marginBottom: "50px",
          }}
        >
          Welcome Back!
        </Typography>
      </div>

      <div className="login-container">
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <Slide direction="right" in={!isMoBNum} mountOnEnter unmountOnExit timeout={300}>
            <Box sx={{ width: '100%' }}>
              <div className="mobile-header">
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 3,
                    fontSize: "0.9rem",
                  }}
                >
                  Enter your mobile number
                </Typography>
              </div>

              <form onSubmit={(e) => {e.preventDefault(); handleClickToGetOtp();}}>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={credential.mobileNumber}
                  onChange={handleChange}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                  InputProps={{
                    maxLength: 10,
                    type: 'number',
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: "#1976d2" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: "#666" },
                    shrink: true,
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="custom-button"
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </Box>
          </Slide>

          <Slide direction="left" in={isMoBNum} mountOnEnter unmountOnExit timeout={300}>
            <Box sx={{ width: '100%' }}>
              <div className="mobile-header">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton 
                    onClick={handleGoBack}
                    sx={{ mr: 1, color: '#1976d2' }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    Enter OTP sent to {credential.mobileNumber}
                  </Typography>
                </Box>
              </div>

              <form onSubmit={handleLogin}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel style={{ color: "#666" }}>Enter OTP</InputLabel>
                  <OutlinedInput
                    required
                    name="password"
                    value={credential.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#1976d2" }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      "&:hover fieldset": {
                        borderColor: "#1976d2 !important",
                      },
                    }}
                    label="Password"
                  />
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="custom-button"
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Box>
          </Slide>
        </Box>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
