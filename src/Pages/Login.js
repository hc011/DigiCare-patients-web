import LockIcon from "@mui/icons-material/Lock";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SecurityIcon from "@mui/icons-material/Security";
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
  Fade,
  Paper,
} from "@mui/material";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserDetailForm from "../patient-demo/UserDetailForm";
import { login as loginService } from "../services/authService";
import { updateUser } from "../services/api";
import OtpInput from "react-otp-input";
import DigiCareLogo from "../assets/DigiCare__logo.png";
import { sendOtp } from "../services/api";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [isMoBNum, setIsMobNum] = useState(false);
  const navigate = useNavigate();
  const [showUserDetailForm, setShowUserDetailForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [otpFilled, setOtpFilled] = useState(false);
  const formRef = useRef(null);
  const mobileInputRef = useRef(null);
  const containerRef = useRef(null);

  const [credential, setCredential] = useState({
    mobileNumber: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Modify the useEffect for auto-focus mobile input to add delay
  useEffect(() => {
    if (mobileInputRef.current && !isMoBNum) {
      // Delay focus to avoid transition stutter
      const timer = setTimeout(() => {
        mobileInputRef.current.focus();
      }, 600); // Delay longer than the transition duration
      return () => clearTimeout(timer);
    }
  }, [isMoBNum]);

  // Timer effect - moved above the conditional return
  useEffect(() => {
    let interval = null;
    if (isMoBNum && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isMoBNum, timer]);

  // Modify the SMS OTP Auto-capture using Web OTP API to add delay
  useEffect(() => {
    if (isMoBNum && "OTPCredential" in window) {
      // Delay OTP capture to avoid transition stutter
      const captureTimer = setTimeout(() => {
        const abortController = new AbortController();

        navigator.credentials
          .get({
            otp: { transport: ["sms"] },
            signal: abortController.signal,
          })
          .then((otp) => {
            if (otp && otp.code) {
              setCredential((prev) => ({ ...prev, password: otp.code }));
              setOtpFilled(true);

              // Add haptic feedback if available
              if (navigator.vibrate) {
                navigator.vibrate([30, 30, 30]);
              }
            }
          })
          .catch((err) => {
            console.log("OTP Credential API error:", err);
          });

        return () => {
          abortController.abort();
        };
      }, 600); // Delay longer than the transition duration

      return () => clearTimeout(captureTimer);
    }
  }, [isMoBNum]);

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

    if (credential.mobileNumber.length !== 10) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 10-digit mobile number",
        severity: "error",
      });
      return;
    }

    // Show OTP screen immediately after validation
    setIsMobNum(true);
    // Reset timer
    setTimer(120);
    setCanResend(false);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Make API call in the background
    setLoading(true);
    try {
      // Call the sendOtp API (now in the background)
      await sendOtp({ phone_number: credential.mobileNumber });
    } catch (error) {
      // Silent failure - industry standard is to not disrupt user experience
      // Users can use resend option if they don't receive the OTP
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      // Call the sendOtp API
      await sendOtp({ phone_number: credential.mobileNumber });

      // Reset the timer after successful API call
      setTimer(120);
      setCanResend(false);

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Mock API call for now
      // await sendOtp(credential.mobileNumber);

      setSnackbar({
        open: true,
        message: "OTP has been resent successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error in resending OTP:", error);
      let errorMessage =
        "Failed to resend OTP. Please try again after a few minutes.";

      // If there's a specific error message from the server
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = `${error.response.data.message}. Please try again after a few minutes.`;
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

  const handleGoBack = () => {
    setIsMobNum(false);
    setCredential((prev) => ({ ...prev, password: "" }));

    // Reset OTP state
    setOtpFilled(false);

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 10 digits
    if (name === "mobileNumber") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setCredential((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setCredential((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOtpChange = (otp) => {
    setCredential((prev) => ({ ...prev, password: otp }));

    // Add animation class when OTP is filled
    if (otp.length === 4) {
      setOtpFilled(true);

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([30, 30, 30]);
      }
    } else {
      setOtpFilled(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (credential.password.length !== 4) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 4-digit OTP",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await loginService(
        credential.mobileNumber,
        credential.password
      );
      console.log("User object:", data.user);

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([30, 50, 100]);
      }

      // Store the user data and appointments list in local storage
      localStorage.setItem("user", JSON.stringify(data));

      if (data.user && data.user.created_user === true) {
        console.log("User needs to complete registration");
        setUserData(data);
        navigate("/register", { state: { userData: data } });
      } else {
        console.log("User already registered, proceeding to patient home");
        setUser(data);
        navigate(
          "/patient",
          { state: { freshLogin: true } },
          { replace: true }
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
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
            errorMessage =
              error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
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
        password: formData.password || "123456789",
      };

      // Call the updateUser API
      const response = await updateUser(updatePayload);
      console.log("User update response:", response);

      // Update the user data with the form information
      const updatedUserData = {
        ...userData,
        user: {
          ...userData.user,
          ...formData,
        },
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
      <Fade in={true} timeout={800}>
        <div className="desktop-content">
          <Box className="logo-container" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src={DigiCareLogo}
              alt="DigiCare Logo"
              className="logo"
              style={{ height: "72px", marginBottom: "8px" }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                fontSize: "1.1rem",
                marginBottom: "4px"
              }}
            >
              Book and Track Appointments
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#1976d2",
                fontWeight: 500,
                fontSize: "0.9rem",
                marginBottom: "16px"
              }}
            >
              Check your waiting number
            </Typography>
          </Box>
        </div>
      </Fade>

      <div
        className="login-container"
        ref={containerRef}
        style={{
          maxWidth: "380px", // Reduce max width from 420px
          width: "85%", // Slightly reduced from 90%
        }}
      >
        <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <Fade in={!isMoBNum} timeout={500} mountOnEnter unmountOnExit>
            <Box sx={{ width: "100%" }}>
              <div className="mobile-header">
                <Typography
                  variant="h6"
                  sx={{
                    color: "#333",
                    mb: 1,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  Login to Your Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 3,
                    fontSize: "0.9rem",
                  }}
                >
                  Enter your mobile number to receive an OTP
                </Typography>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClickToGetOtp();
                }}
              >
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={credential.mobileNumber}
                  onChange={handleChange}
                  inputRef={mobileInputRef}
                  autoComplete="tel-national"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    "aria-label": "Mobile number",
                  }}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
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

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="custom-button"
                  aria-label="Get OTP button"
                  sx={{
                    py: 1.5,
                    borderRadius: "10px",
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
                    "Get Verification Code"
                  )}
                </Button>
              </form>
            </Box>
          </Fade>

          <Fade in={isMoBNum} timeout={500} mountOnEnter unmountOnExit>
            <Box sx={{ width: "100%" }}>
              <div className="mobile-header">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      SMS verification code sent to {credential.mobileNumber}
                    </Typography>
                  </Box>
                </Box>
              </div>

              <form onSubmit={handleLogin} ref={formRef}>
                <Box sx={{ mb: 3, mt: 2 }}>
                  {/* <SecurityIcon sx={{ color: '#1976d2', fontSize: 18, mr: 1 }} /> */}
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mb: 2, textAlign: "left" }}
                  >
                    Enter 4-digit OTP
                  </Typography>
                  <div
                    className={`otp-container ${
                      otpFilled ? "otp-input-filled" : ""
                    }`}
                  >
                    <OtpInput
                      value={credential.password}
                      onChange={handleOtpChange}
                      numInputs={4}
                      renderSeparator={<span style={{ width: "6px" }}></span>}
                      renderInput={(props) => (
                        <input
                          {...props}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          aria-label="OTP digit input"
                        />
                      )}
                      containerStyle={{
                        justifyContent: "space-between",
                        margin: "0 auto",
                      }}
                      inputStyle={{
                        width: "45px",
                        height: "45px",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f8f9fa",
                      }}
                      focusStyle={{
                        border: "1px solid #1976d2",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                      }}
                      shouldAutoFocus
                    />
                  </div>
                </Box>

                {/* Resend OTP Timer */}
                <Box className="resend-timer">
                  {!canResend ? (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Didn't get the OTP? Resend in <strong>{timer}</strong>{" "}
                      seconds
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography
                        className="resend-link"
                        variant="body2"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </Typography>
                      <Typography
                        className="resend-link"
                        variant="body2"
                        onClick={handleGoBack}
                      >
                        Change Mobile Number
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || credential.password.length !== 4}
                  className="custom-button"
                  aria-label="Login button"
                  sx={{
                    py: 1.5,
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                    opacity: credential.password.length === 4 ? 1 : 0.8,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
              </form>
            </Box>
          </Fade>
        </Box>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            alignItems: "center",
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
