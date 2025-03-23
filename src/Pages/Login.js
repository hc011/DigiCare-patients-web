import LockIcon from "@mui/icons-material/Lock";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserDetailForm from "../patient-demo/UserDetailForm";
import { login as loginService } from "../services/authService";

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
      
      if (data.created_user) {
        setUserData(data);
        setShowUserDetailForm(true);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        await new Promise((resolve) => setTimeout(resolve, 50));
        navigate("/", { state: { freshLogin: true } }, { replace: true });
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
      // Dummy API call to update user details
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      navigate("/patient-home", { state: { freshLogin: true } }, { replace: true });
    } catch (error) {
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
        <div className="mobile-header">
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mb: 4,
              fontSize: "0.9rem",
            }}
          >
            Sign in to continue
          </Typography>
        </div>

        <form onSubmit={handleLogin}>
          {!isMoBNum && (
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
          )}

          {isMoBNum && (
            <FormControl fullWidth sx={{ mb: 4 }}>
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
          )}

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
            onClick={isMoBNum ? handleLogin : handleClickToGetOtp}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isMoBNum ? "Login" : "Send OTP"
            )}
          </Button>
        </form>
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

      <UserDetailForm
        open={showUserDetailForm}
        onClose={() => {
          setShowUserDetailForm(false);
          navigate('/login');
        }}
        onSubmit={handleUserDetailSubmit}
      />
    </div>
  );
};

export default Login;
