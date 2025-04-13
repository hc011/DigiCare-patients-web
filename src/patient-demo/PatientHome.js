import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import InfoIcon from "@mui/icons-material/Info";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import QueueIcon from "@mui/icons-material/Queue";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import { formatSecondsToHoursMinutes } from "../utils/timeUtils";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthContext } from "../context/AuthContext";
import {
  getAllAppointments,
  getAppointmentDetails,
  removeAppointment,
} from "../services/api";

const AppointmentSkeleton = () => (
  <Card
    elevation={1}
    sx={{
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box sx={{ bgcolor: "#1976d2", color: "white", p: 2 }}>
      <Skeleton
        variant="text"
        width="60%"
        height={24}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={20}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}
      />
    </Box>
    <CardContent>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="text" width="70%" height={24} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="text" width="40%" height={24} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={32}
              sx={{ mx: "auto" }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={32}
              sx={{ mx: "auto" }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}
        >
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ borderRadius: 2, mr: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={36}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={36}
            sx={{ borderRadius: 2, mt: 2 }}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Create Slide transition component for the Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PatientHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const { user } = useContext(AuthContext);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [isWaitingRefreshing, setIsWaitingRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCurrentAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAllAppointments("upcoming");

      // Sort appointments by waiting position, with non-late before late
      const sortedAppointments = response.sort((a, b) => {
        // First prioritize non-late appointments
        if (a.queobj?.late !== b.queobj?.late) {
          return a.queobj?.late ? 1 : -1;
        }
        // Then sort by waiting position
        return (a.queobj?.waiting || 0) - (b.queobj?.waiting || 0);
      });

      setCurrentAppointments(sortedAppointments);
      setLastUpdatedTime(new Date());
    } catch (error) {
      console.error("Error fetching current appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAppointments();
  }, []);

  const fetchAppointmentdetails = async (appointment_id) => {
    try {
      const response = await getAppointmentDetails(appointment_id);
      setSelectedAppointment(response);
    } catch (error) {
      console.error("Error fetching current appointments:", error);
    } finally {
    }
  };

  const handleWaitingReload = async () => {
    try {
      setIsWaitingRefreshing(true);
      const response = await getAllAppointments("upcoming");

      // Update waiting, wait_time and late status for existing appointments
      setCurrentAppointments((prevAppointments) => {
        return prevAppointments.map((prevApp) => {
          const updatedApp = response.find(
            (newApp) => newApp.appointment_id === prevApp.appointment_id
          );
          if (updatedApp) {
            return {
              ...prevApp,
              queobj: {
                ...prevApp.queobj,
                waiting: updatedApp.queobj?.waiting,
                wait_time: updatedApp.queobj?.wait_time,
                late: updatedApp.queobj?.late,
              },
            };
          }
          return prevApp;
        });
      });

      // Update last updated time
      setLastUpdatedTime(new Date());
    } catch (error) {
      console.error("Error refreshing waiting times:", error);
    } finally {
      setIsWaitingRefreshing(false);
    }
  };

  // Get patient details from localStorage
  const getPatientDetails = (patientId) => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const patients = userData.patients || [];
        return (
          patients.find((patient) => patient.patient_id === patientId) || null
        );
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
    return null;
  };
  const appointmentsList = currentAppointments;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    // Check if we should show appointment based on URL param or existing appointments
    const urlParams = new URLSearchParams(location.search);
    if (
      urlParams.get("appointmentBooked") === "true" ||
      location.state?.bookingSuccess
    ) {
      setHasAppointment(true);
      setShowBookingSuccess(true);

      // Clear success message after some time
      const successTimer = setTimeout(() => {
        setShowBookingSuccess(false);
      }, 4000);

      return () => {
        clearTimeout(successTimer);
      };
    } else if (appointmentsList.length > 0) {
      setHasAppointment(true);
    }
  }, [location, appointmentsList]);

  // Add interval to update wait times every 2 minutes
  useEffect(() => {
    // Set up interval to fetch fresh data every 2 minutes (120000 ms)
    const interval = setInterval(() => {
      handleWaitingReload();
    }, 120000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Force UI update for the "last updated" time display every minute
  useEffect(() => {
    // Update the formatted time display every minute to show elapsed time
    const timeDisplayInterval = setInterval(() => {
      // This forces a component re-render to update the "time ago" display
      setLastUpdatedTime((prevTime) => new Date(prevTime.getTime()));
    }, 60000);

    return () => clearInterval(timeDisplayInterval);
  }, []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    // Adjust for timezone offset
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = adjustedDate.getFullYear();
    const hours = adjustedDate.getHours();
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  const handleViewDetails = async (appointment_id) => {
    await fetchAppointmentdetails(appointment_id);
    // Add to history stack when opening dialog
    window.history.pushState({ showAppointmentDetails: true }, "");
    setShowAppointmentDetails(true);
  };

  // Handle browser back button/gesture
  useEffect(() => {
    const handlePopState = (event) => {
      if (showAppointmentDetails) {
        setShowAppointmentDetails(false);
        // Also refresh data when closing via back button/gesture
        handleWaitingReload();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showAppointmentDetails]);

  const handleCloseAppointmentDetails = () => {
    // Go back in history when closing dialog with button
    if (showAppointmentDetails) {
      window.history.back();
    }
    setShowAppointmentDetails(false);

    // Refresh appointment data when modal is closed
    handleWaitingReload();
  };

  const handleCall = () => {
    window.open(`tel:${selectedAppointment?.cabin?.hospital?.phone_number}`);
  };

  const handleDirections = (location) => {
    const coordinates = location.split(",");
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    const address = `${latitude},${longitude}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`
    );
  };

  // Format time for last updated display
  const formatLastUpdatedTime = (date) => {
    if (!date) return "";

    // Get current time and calculate time difference in seconds
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);

    // Show time in 10-second intervals
    if (diffSecs < 10) {
      return "just now";
    } else {
      // Round down to nearest 10 seconds
      const roundedSecs = Math.floor(diffSecs / 10) * 10;

      // Convert to minutes if more than 60 seconds
      if (roundedSecs >= 60) {
        const diffMins = Math.floor(diffSecs / 60);
        return diffMins === 1 ? "1 min ago" : `${diffMins} mins ago`;
      }

      return `${roundedSecs} seconds ago`;
    }
  };

  const handleCancelAppointment = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment?.appointment_id) return;

    setIsCanceling(true);
    try {
      const payload = {
        appointment_id: selectedAppointment.appointment_id,
      };
      await removeAppointment(payload);

      // Close all dialogs
      setShowCancelDialog(false);
      setShowAppointmentDetails(false);

      // Show success message
      setSnackbar({
        open: true,
        message: "Appointment cancelled successfully",
        severity: "success",
      });

      // Refresh appointments list
      fetchCurrentAppointments();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to cancel appointment",
        severity: "error",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{ p: 2, pb: 16, height: "calc(100vh - 180px)", overflowY: "auto" }}
    >
      {/* Success Message */}
      {showBookingSuccess && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#4caf50",
            color: "white",
            py: 2,
            px: 3,
            borderRadius: 2,
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            animation: "slideIn 0.5s ease-out",
            "@keyframes slideIn": {
              "0%": {
                transform: "translate(-50%, -100%)",
                opacity: 0,
              },
              "100%": {
                transform: "translate(-50%, 0)",
                opacity: 1,
              },
            },
          }}
        >
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <Typography variant="body1" fontWeight="medium">
            Appointment booked successfully!
          </Typography>
        </Box>
      )}

      {/* Header with greeting */}
      {/* <Box sx={{ mb: 4 }}>
                                        <Typography variant="h5" fontWeight="600" gutterBottom>
                                            Welcome back, {user?.username || 'Patient'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </Box> */}

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: "pointer",
              bgcolor: "#eef2ff",
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
              "&:active": {
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => navigate("/doctor/2")}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "#4f46e5", mx: "auto", mb: 1 }}>
                <AddIcon />
              </Avatar>
              <Typography variant="body1" fontWeight="medium">
                Book Appointment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: "pointer",
              bgcolor: "#f0fdf4",
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
              "&:active": {
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => navigate("/appointments")}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "#15803d", mx: "auto", mb: 1 }}>
                <CalendarTodayIcon />
              </Avatar>
              <Typography variant="body1" fontWeight="medium">
                My Appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Current Appointment Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Current Appointments
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(25, 118, 210, 0.08)",
              borderRadius: 1.5,
              px: 1,
              py: 0.5,
            }}
          >
            <ChevronLeftIcon
              sx={{
                fontSize: 18,
                color: "primary.main",
                opacity: 0.7,
                mr: 0.5,
              }}
            />
            <Typography
              variant="body2"
              color="primary.main"
              fontWeight="medium"
            >
              {appointmentsList.length > 0
                ? `${activeStep + 1}/${appointmentsList.length}`
                : ""}
            </Typography>
            <ChevronRightIcon
              sx={{
                fontSize: 18,
                color: "primary.main",
                opacity: 0.7,
                ml: 0.5,
              }}
            />
          </Box>
        </Box>
        {loading ? (
          <AppointmentSkeleton />
        ) : appointmentsList.length > 0 ? (
          <Box sx={{ position: "relative" }}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={false}
              pagination={{
                clickable: true,
              }}
              onSlideChange={(swiper) => handleStepChange(swiper.activeIndex)}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                "--swiper-pagination-color": "#1976d2",
              }}
              direction="horizontal"
              touchEventsTarget="container"
              touchRatio={1}
              touchAngle={45}
              grabCursor={true}
              nested={true}
              observer={true}
              observeParents={true}
              threshold={5}
            >
              {appointmentsList.map((appointment, index) => (
                <SwiperSlide key={appointment.appointment_id}>
                  <Box sx={{ px: 0.5, pb: 1 }}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      {/* Card Header */}
                      <Box
                        sx={{
                          bgcolor: "#1976d2",
                          color: "white",
                          p: 2,
                          position: "relative",
                          backgroundImage:
                            "linear-gradient(to right, #1976d2, #2196f3)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight="600"
                              sx={{ fontSize: "1.1rem", mb: 0.5 }}
                            >
                              Dr. {appointment?.doctor}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <MedicalServicesIcon
                                sx={{ fontSize: 16, mr: 0.8, opacity: 0.8 }}
                              />
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {appointment?.hospital}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDirections(appointment.hospital_location);
                            }}
                            sx={{
                              color: "white",
                              bgcolor: "rgba(255,255,255,0.15)",
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.25)",
                              },
                              textTransform: "none",
                              fontSize: "0.75rem",
                              px: 1.5,
                              py: 0.5,
                            }}
                            startIcon={
                              <DirectionsIcon sx={{ fontSize: "0.9rem" }} />
                            }
                          >
                            Map
                          </Button>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 0 }}>
                        {/* Combined Info Section - Compact Layout */}
                        <Box
                          sx={{
                            p: 2,
                            borderBottom: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <Grid container spacing={2}>
                            {/* Elevated Queue Information */}
                            <Grid item xs={12}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: appointment?.queobj?.late
                                    ? "#fff7ed"
                                    : appointment?.queobj?.waiting === 0
                                    ? "#ecfdf5"
                                    : "#f0f9ff",
                                  border: "1px solid",
                                  borderColor: appointment?.queobj?.late
                                    ? "#fdba74"
                                    : appointment?.queobj?.waiting === 0
                                    ? "#86efac"
                                    : "#bae6fd",
                                  mb: 1,
                                }}
                              >
                                {appointment?.queobj?.late ? (
                                  <>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "100%",
                                        maxWidth: 450,
                                      }}
                                    >
                                      <Typography
                                        variant="h5"
                                        sx={{
                                          fontWeight: "bold",
                                          color: "#ea580c",
                                          textAlign: "center",
                                        }}
                                      >
                                        Running Late
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          color: "#c2410c",
                                          textAlign: "center",
                                          mt: 1,
                                        }}
                                      >
                                        Don't worry, just pay at the clinic when
                                        you arrive to join the queue
                                      </Typography>
                                    </Box>
                                  </>
                                ) : appointment?.queobj?.waiting === 0 ? (
                                  <>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <CheckCircleIcon
                                        sx={{
                                          color: "#15803d",
                                          mr: 2,
                                          fontSize: 32,
                                        }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            color: "#15803d",
                                            fontWeight: 700,
                                          }}
                                        >
                                          YOUR TURN
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#059669",
                                            display: "block",
                                          }}
                                        >
                                          Ready to see doctor
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Box
                                      sx={{
                                        bgcolor: "#15803d",
                                        color: "white",
                                        borderRadius: 1,
                                        px: 1.5,
                                        py: 0.5,
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      NOW
                                    </Box>
                                  </>
                                ) : (
                                  <>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <QueueIcon
                                        sx={{
                                          color: "#0284c7",
                                          mr: 2,
                                          fontSize: 32,
                                        }}
                                      />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            width: "100%",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            sx={{
                                              color: "#0284c7",
                                              fontWeight: 700,
                                            }}
                                          >
                                            Waiting:{" "}
                                            {appointment?.queobj?.waiting !==
                                            undefined
                                              ? appointment?.queobj?.waiting
                                              : "-"}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                            }}
                                          >
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleWaitingReload();
                                              }}
                                              disabled={isWaitingRefreshing}
                                              sx={{
                                                bgcolor: "#e0f2fe",
                                                width: 36,
                                                height: 36,
                                                mb: 0.5,
                                                "&:hover": {
                                                  bgcolor: "#bae6fd",
                                                },
                                              }}
                                            >
                                              <RefreshIcon
                                                sx={{
                                                  fontSize: "1.2rem",
                                                  color: "#0284c7",
                                                  animation: isWaitingRefreshing
                                                    ? "spin 1s linear infinite"
                                                    : "none",
                                                  "@keyframes spin": {
                                                    "0%": {
                                                      transform: "rotate(0deg)",
                                                    },
                                                    "100%": {
                                                      transform:
                                                        "rotate(360deg)",
                                                    },
                                                  },
                                                }}
                                              />
                                            </IconButton>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: "0.6rem",
                                                color: "#64748b",
                                                lineHeight: 1,
                                              }}
                                            >
                                              Refresh
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <Typography
                                          variant="subtitle1"
                                          sx={{
                                            color: "#0284c7",
                                            fontWeight: 600,
                                          }}
                                        >
                                          {/* Wait time: ~
                                          {formatSecondsToHoursMinutes(
                                            appointment?.queobj?.wait_time
                                          )}{" "}
                                          <Typography
                                            component="span"
                                            variant="caption"
                                            sx={{
                                              color: "#64748b",
                                              fontStyle: "italic",
                                              fontSize: "0.7rem",
                                            }}
                                          >
                                            (Estimated)
                                          </Typography> */}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </>
                                )}
                              </Box>
                              {/* Last updated displayed for both late and waiting situations */}
                              {(appointment?.queobj?.waiting !== 0 ||
                                appointment?.queobj?.late) && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.7rem",
                                    display: "block",
                                    textAlign: "right",
                                    mb: 2,
                                  }}
                                >
                                  Last updated:{" "}
                                  {formatLastUpdatedTime(lastUpdatedTime)}
                                </Typography>
                              )}
                            </Grid>

                            {/* Payment Reminder Message - Moved outside the waiting card */}
                            {!appointment?.queobj?.paid &&
                              appointment?.queobj?.waiting !== 0 &&
                              !appointment?.queobj?.late &&
                              appointment?.queobj?.waiting >
                                parseInt(appointment?.buffer) && (
                                <Grid item xs={12}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mb: 2,
                                      pl: 1,
                                      mt: -3,
                                    }}
                                  >
                                    <PaymentIcon
                                      sx={{
                                        fontSize: 18,
                                        mr: 1,
                                        color: "#eab308",
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#854d0e",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Please pay at the clinic before your
                                      waiting becomes {appointment?.buffer}
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}

                            {/* Secondary Information - Reduced prominence */}
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                px: 1,
                                mx: 0, // Override negative margin
                                width: "100%", // Ensure full width
                              }}
                            >
                              {/* SLOT DETAILS - Commented out
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CalendarTodayIcon sx={{ color: '#94a3b8', mr: 1, fontSize: '0.875rem' }} />
                                                                    <Box>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', fontSize: '0.6rem' }}>
                                                                            SLOT DETAILS
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8rem' }}>
                                                                            {formatDate(appointment?.slot)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                    </Grid>
                                                            */}

                              <Grid item xs={6} sm={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight: 500,
                                    display: "block",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Patient name
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {appointment?.patient_name}
                                </Typography>
                              </Grid>

                              <Grid item xs={6} sm={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight: 500,
                                    display: "block",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Patient ID
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {appointment?.pid || "—"}
                                </Typography>
                              </Grid>

                              {/* <Grid item xs={6} sm={3}>
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', fontSize: '0.6rem' }}>
                                                                    PHONE
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.8rem' }}>
                                                                    {appointment?.phone_number || "—"}
                                                                </Typography>
                                                            </Grid> */}

                              {/* <Grid item xs={6} sm={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight: 500,
                                    display: "block",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Token
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="700"
                                  sx={{
                                    color: "text.primary",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {appointment?.token}
                                </Typography>
                              </Grid> */}
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Action Button */}
                        <Box sx={{ p: 1.5 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              py: 1,
                              fontWeight: 600,
                              textTransform: "none",
                              transition: "all 0.2s",
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                              },
                            }}
                            onClick={() =>
                              handleViewDetails(appointment.appointment_id)
                            }
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            <style>
              {`
                            .swiper-pagination {
                                position: relative !important;
                                margin-top: 0 !important;
                                bottom: 0 !important;
                            }
                            .swiper-pagination-bullet {
                                width: 8px;
                                height: 8px;
                                margin: 0 2px;
                            }
                            .swiper-pagination-bullet-active {
                                background: #1976d2;
                            }
                            .swiper-container {
                                overflow: hidden;
                                touch-action: pan-x pan-y;
                            }
                            .swiper-wrapper {
                                height: auto;
                                touch-action: pan-x pan-y;
                            }
                            .swiper-slide {
                                height: auto;
                                overflow: visible;
                            }
                            `}
            </style>
          </Box>
        ) : (
          <Card
            elevation={1}
            sx={{
              borderRadius: 3,
              mb: 4,
              p: 3,
              bgcolor: "#fafafa",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box sx={{ textAlign: "center", py: 4 }}>
              <EventBusyIcon sx={{ fontSize: 48, color: "#9ca3af", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Appointments Scheduled
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You don't have any scheduled appointments currently.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/doctor/2")}
                sx={{
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Book appointment
              </Button>
            </Box>
          </Card>
        )}
      </Box>

      {/* Popular Specialties */}
      {/* <Typography variant="h6" fontWeight="600" gutterBottom>
                Popular Specialties
            </Typography>
            <Grid container spacing={2} sx={{ mb: 8 }}>
                {["Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician"].map((specialty, index) => (
                    <Grid item xs={6} key={index}>
                        <Card sx={{
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            },
                            '&:active': {
                                transform: 'translateY(-2px)',
                            }
                        }}
                            onClick={() => navigate("/search")}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="body1">
                                    {specialty}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid> */}

      {/* Appointment Details Slide-up Panel */}
      <Dialog
        open={showAppointmentDetails}
        onClose={handleCloseAppointmentDetails}
        fullScreen
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: "hidden",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            px: 2.5,
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="back"
              onClick={handleCloseAppointmentDetails}
              sx={{
                color: "white",
                mr: 1.5,
                bgcolor: "rgba(255,255,255,0.12)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="600">
              Appointment Details
            </Typography>
          </Box>
        </Box>

        <DialogContent
          sx={{
            py: 3,
            px: 3,
            bgcolor: "#f8fafc",
            background: "linear-gradient(to bottom, #f1f5f9 0%, #f8fafc 100%)",
          }}
        >
          {/* Appointment Progress Status */}
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2, px: 0.5 }}>
            Appointment Status
          </Typography>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {/* Payment Status - Now Step 1 */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: selectedAppointment?.queobj?.paid
                          ? "rgba(21, 128, 61, 0.1)"
                          : "rgba(234, 179, 8, 0.1)",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {selectedAppointment?.queobj?.paid ? (
                        <ReceiptIcon sx={{ color: "#15803d" }} />
                      ) : (
                        <PaymentIcon sx={{ color: "#eab308" }} />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Step 1: Payment
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: selectedAppointment?.queobj?.paid
                            ? "#15803d"
                            : "#eab308",
                          mt: 0.5,
                        }}
                      >
                        {selectedAppointment?.queobj?.paid
                          ? "Completed"
                          : "Action Required"}
                      </Typography>
                      {!selectedAppointment?.queobj?.paid ? (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            borderRadius: 2,
                            bgcolor: "rgba(234, 179, 8, 0.08)",
                            border: "1px solid",
                            borderColor: "rgba(234, 179, 8, 0.3)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#854d0e", fontWeight: 500 }}
                          >
                            {selectedAppointment?.fees_paid > 0
                              ? `Please pay ₹${selectedAppointment.fees_paid} at the reception desk`
                              : "Please complete payment at the reception desk"}
                          </Typography>
                        </Box>
                      ) : (
                        selectedAppointment?.fees_paid > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              display: "block",
                              mt: 1,
                              fontWeight: 500,
                              color: "#15803d",
                            }}
                          >
                            Amount Paid: ₹{selectedAppointment.fees_paid}
                          </Typography>
                        )
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Check-in Status - Now Step 2 */}
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: selectedAppointment?.queobj?.checkin
                          ? "rgba(21, 128, 61, 0.1)"
                          : "rgba(234, 179, 8, 0.1)",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {selectedAppointment?.queobj?.checkin ? (
                        <CheckCircleIcon sx={{ color: "#15803d" }} />
                      ) : (
                        <WarningIcon sx={{ color: "#eab308" }} />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Step 2: Check-in
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: selectedAppointment?.queobj?.checkin
                            ? "#15803d"
                            : "#eab308",
                          mt: 0.5,
                        }}
                      >
                        {selectedAppointment?.queobj?.checkin
                          ? "Completed"
                          : "Action Required"}
                      </Typography>
                      {!selectedAppointment?.queobj?.checkin && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            borderRadius: 2,
                            bgcolor: "rgba(234, 179, 8, 0.08)",
                            border: "1px solid",
                            borderColor: "rgba(234, 179, 8, 0.3)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#854d0e", fontWeight: 500 }}
                          >
                            Please visit the reception desk to check in for your
                            appointment
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 0.5 }} />
                </Grid>

                {/* Waiting Position & Time Combined - Smaller size now */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {/* Removing the "Complete the steps above to join the queue" message */}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        width: "100%",
                      }}
                    >
                      {selectedAppointment?.queobj?.late ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            bgcolor: "#fff7ed",
                            border: "1px solid #fdba74",
                            borderRadius: 2,
                            p: 2,
                            width: "100%",
                            maxWidth: 450,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: "bold",
                              color: "#ea580c",
                              textAlign: "center",
                            }}
                          >
                            Running Late
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#c2410c",
                              textAlign: "center",
                              mt: 1,
                            }}
                          >
                            Don't worry, just pay at the clinic when you arrive
                            to join the queue
                          </Typography>
                        </Box>
                      ) : selectedAppointment?.queobj?.waiting === 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            bgcolor: "#ecfdf5",
                            border: "1px solid #86efac",
                            borderRadius: 2,
                            p: 2,
                            width: "100%",
                            maxWidth: 300,
                          }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "#15803d", fontSize: 32 }}
                          />
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: "bold",
                              color: "#15803d",
                              mt: 1,
                            }}
                          >
                            YOUR TURN
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#047857",
                              textAlign: "center",
                              mt: 1,
                            }}
                          >
                            Please proceed to the doctor's room
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="overline"
                              sx={{ color: "primary.main", fontWeight: 600 }}
                            >
                              Waiting
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              {selectedAppointment?.queobj?.waiting !==
                              undefined
                                ? selectedAppointment?.queobj?.waiting
                                : "-"}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Primary Appointment Information */}
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2, px: 0.5 }}>
            Appointment Details
          </Typography>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              p: 2.5,
              mb: 3,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Slot
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                  {selectedAppointment?.cabinslot?.slot &&
                    formatDate(selectedAppointment?.cabinslot?.slot)}
                </Typography>
              </Grid>

              {/* Adding Waiting information to appointment details */}
              {selectedAppointment?.queobj?.waiting !== undefined &&
                !selectedAppointment?.queobj?.late &&
                selectedAppointment?.queobj?.waiting > 0 && (
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Waiting
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{
                        mt: 0.5,
                        color: "primary.main",
                      }}
                    >
                      {selectedAppointment?.queobj?.waiting}
                    </Typography>
                  </Grid>
                )}

              {/* Add Payment field */}
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Payment
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    mt: 0.5,
                    color: selectedAppointment?.queobj?.paid
                      ? "#15803d"
                      : "#d32f2f",
                  }}
                >
                  {selectedAppointment?.queobj?.paid ? "Paid" : "Not Paid"}
                </Typography>
              </Grid>

              {/* Add Check-in field */}
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Check-in
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    mt: 0.5,
                    color: selectedAppointment?.queobj?.checkin
                      ? "#15803d"
                      : "#d32f2f",
                  }}
                >
                  {selectedAppointment?.queobj?.checkin ? "Done" : "Pending"}
                </Typography>
              </Grid>

              {selectedAppointment?.token && (
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Token Number
                  </Typography>
                  <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.token}
                  </Typography>
                </Grid>
              )}

              {selectedAppointment?.disease &&
                selectedAppointment?.disease !== "Not specified" && (
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Health Issue
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{ mt: 0.5 }}
                    >
                      {selectedAppointment.disease}
                    </Typography>
                  </Grid>
                )}

              {selectedAppointment?.mode && (
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Payment Mode
                  </Typography>
                  <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                    {selectedAppointment.mode}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>

          {/* Accordion Sections for Patient and Doctor Info */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Patient Information Section */}
            <Box sx={{ p: 2.5, borderBottom: "1px solid #e5e7eb" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="600">
                  Patient Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.patient?.phone_number ||
                      "Not provided"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Patient ID
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.patient?.patient_id}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Age
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.patient?.age}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Gender
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                    {selectedAppointment?.patient?.gender === "M"
                      ? "Male"
                      : selectedAppointment?.patient?.gender === "F"
                      ? "Female"
                      : selectedAppointment?.patient?.gender}
                  </Typography>
                </Grid>

                {/* Add Appointment Type to patient information */}
                {selectedAppointment?.appointmentType && (
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Appointment Type
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ mt: 0.5 }}
                    >
                      {selectedAppointment.appointmentType}
                    </Typography>
                  </Grid>
                )}

                {selectedAppointment?.patient?.allergies && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Allergies
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ mt: 0.5 }}
                    >
                      {selectedAppointment.patient.allergies}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Doctor Information Section */}
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <MedicalServicesIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="600">
                  Clinic & Doctor
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Clinic
              </Typography>
              <Typography variant="body1" fontWeight="500" sx={{ mb: 2 }}>
                {selectedAppointment?.cabin?.hospital?.hospital_name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Doctor
              </Typography>
              <Typography variant="body1" fontWeight="500" sx={{ mb: 2 }}>
                Dr. {selectedAppointment?.cabin?.doctor?.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<DirectionsIcon />}
                  onClick={() => {
                    console.log(selectedAppointment);
                    handleDirections(
                      selectedAppointment?.cabin?.hospital?.map_location
                    );
                  }}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    mr: 2,
                    textTransform: "none",
                  }}
                >
                  Get Directions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  onClick={handleCall}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Call Clinic
                </Button>
              </Box>
            </Box>
          </Card>

          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                setShowAppointmentDetails(false);
                navigate("/doctor/2");
              }}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
                mb: 2,
              }}
            >
              View Doctor Profile
            </Button>

            <Button
              onClick={handleCancelAppointment}
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                mb: 2,
                borderColor: "error.main",
                "&:hover": {
                  backgroundColor: "error.50",
                  borderColor: "error.dark",
                },
              }}
            >
              Cancel Appointment
            </Button>

            <Button
              onClick={handleCloseAppointmentDetails}
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Cancel Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowCancelDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            No, Keep It
          </Button>
          <Button
            onClick={confirmCancelAppointment}
            color="error"
            variant="contained"
            disabled={isCanceling}
            sx={{
              borderRadius: 2,
              minWidth: 100,
            }}
          >
            {isCanceling ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Yes, Cancel"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientHome;
