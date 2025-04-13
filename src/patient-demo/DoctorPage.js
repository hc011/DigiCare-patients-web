import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import EventIcon from "@mui/icons-material/Event";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MessageIcon from "@mui/icons-material/Message";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Rating,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { AuthContext } from "../context/AuthContext";
import { addAppointment, getCabinInfo } from "../services/api";

const DoctorPage = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [bookingStage, setBookingStage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [patientType, setPatientType] = useState("self");
  const [familyMember, setFamilyMember] = useState({
    name: "",
    relation: "",
    age: "",
    gender: "M",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [cabinInfo, setCabinInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    guardian: "",
    location: "",
    healthIssue: "",
    appointmentType: "New",
    selectedSlot: null,
    patientId: null,
    formSubmitted: false,
  });

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const patients = userData.patients || [];
  const slots = cabinInfo?.slots || [];

  const { user, setUser } = useContext(AuthContext);
  const [appointmentResponse, setAppointmentResponse] = useState(null);

  // Function to format the next_active date
  const formatNextAvailable = (dateTimeString) => {
    if (!dateTimeString) return "-";

    const date = new Date(dateTimeString);
    // Adjust for timezone offset
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    const day = adjustedDate.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[adjustedDate.getMonth()];
    const hours = adjustedDate.getHours();
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

    // Add ordinal suffix to day
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${ordinalSuffix(
      day
    )} ${month}, ${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchCabinInfo = async () => {
      try {
        const response = await getCabinInfo(doctorId);
        console.log("API Response:", response);
        setCabinInfo(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cabin info:", error);
        setLoading(false);
      }
    };

    fetchCabinInfo();
  }, [doctorId]);

  // Transform cabinInfo into doctor object with fallbacks
  const doctor = {
    id: cabinInfo?.id || parseInt(doctorId),
    name: cabinInfo?.doctor?.name || "Dr. Rahul Gupta",
    specialty: cabinInfo?.doctor?.specialization || "Skin Specialist",
    clinic:
      cabinInfo?.hospital?.hospital_name || "Gupta Skin and dental clinic",
    address:
      cabinInfo?.hospital?.map_location || "Station Road, Alwar, Rajasthan",
    rating: parseFloat(cabinInfo?.doctor?.rating) || 4.7,
    reviews: 543, // Fallback since not in API
    experience: `${cabinInfo?.doctor?.experience || 15}`,
    education: "MBBS, MD (General Medicine)", // Fallback since not in API
    about: `Dr. ${
      cabinInfo?.doctor?.name || "Rahul Gupta"
    } is a highly experienced with over ${
      cabinInfo?.doctor?.experience || 15
    } years of practice. Dr. ${
      cabinInfo?.doctor?.name || "Rahul Gupta"
    } is known for his patient-centric approach and dedication to providing personalized care.`, // Fallback since not in API
    timings: {
      mon: "1:00 PM - 7:00 PM",
      tue: "1:00 PM - 7:00 PM",
      wed: "1:00 PM - 7:00 PM",
      thu: "1:00 PM - 7:00 PM",
      fri: "1:00 PM - 7:00 PM",
      sat: "1:00 AM - 7:00 PM",
      sun: "10:00 AM - 3:00 PM",
    }, // Fallback since not in API
    fees: `₹${cabinInfo?.fees || 500}`,
    currentToken: 8, // Fallback since not in API
    yourToken: 15, // Fallback since not in API
    estimatedWaitTime: "25 mins", // Fallback since not in API
    phone: cabinInfo?.doctor?.phone_number || "---",
    currentStatus: cabinInfo?.is_active
      ? "Available"
      : "Currently Not Available",
    slots: cabinInfo?.slots || [],
  };

  console.log("Cabin Info State:", cabinInfo);
  console.log("Transformed Doctor Object:", doctor);

  // Calculate people ahead
  // const getPeopleAhead = () => {
  //   return Math.max(0, doctor.yourToken - doctor.currentToken);
  // };

  const days = [
    { day: "Today", date: "15 May", slots: 8 },
    { day: "Tomorrow", date: "16 May", slots: 12 },
    { day: "Wed", date: "17 May", slots: 10 },
    { day: "Thu", date: "18 May", slots: 9 },
    { day: "Fri", date: "19 May", slots: 7 },
    { day: "Sat", date: "20 May", slots: 5 },
  ];

  const reviewData = [
    {
      name: "Rahul Sharma",
      date: "12 Apr 2023",
      rating: 5,
      review:
        "Excellent doctor! Very knowledgeable and took time to explain my skin condition. The prescribed treatment worked well for me.",
    },
    {
      name: "Priya Patel",
      date: "28 Mar 2023",
      rating: 4,
      review:
        "Good experience overall. Waited a bit longer than expected but the consultation was thorough and helpful.",
    },
    {
      name: "Amit Kumar",
      date: "15 Mar 2023",
      rating: 5,
      review:
        "Dr.Amit mittal is very professional and friendly. He addressed all my concerns and the treatment was effective. Highly recommend!",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDayChange = (index) => {
    setSelectedDay(index);
  };

  const handleBookNow = () => {
    setShowBookingDialog(true);
  };

  const handleCloseDialog = () => {
    setShowBookingDialog(false);
    setBookingStage(0);
    setPatientType("self");
    setFamilyMember({
      name: "",
      relation: "",
      age: "",
      gender: "",
    });

    // Reset all form data
    setFormData({
      name: "",
      age: "",
      gender: "",
      guardian: "",
      location: "",
      healthIssue: "",
      appointmentType: "New",
      selectedSlot: null,
      patientId: null,
      formSubmitted: false,
    });
  };

  const handleFormChange = (field, value) => {
    // Convert patient name, guardian, and location to uppercase
    if (field === "name" || field === "guardian" || field === "location") {
      value = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePatientSelect = (event, value) => {
    if (value) {
      if (typeof value === "string") {
        // Handle freeSolo input - convert to uppercase
        setFormData((prev) => ({
          ...prev,
          name: value.toUpperCase(),
          patientId: null,
        }));
      } else {
        // Handle selection from options
        setFormData((prev) => ({
          ...prev,
          name: value.name,
          age: value.age || "",
          gender: value.gender || "M",
          guardian: value.guardian || "",
          location: value.location || "",
          patientId: value.patient_id,
        }));

        // Only close keyboard when selecting from dropdown (not during typing)
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    }
  };

  // Add a separate function for handling input changes
  const handlePatientInputChange = (event, value) => {
    if (value === "") {
      // If value is cleared, reset patient information
      handleClearPatient();
    }
  };

  // Add a new function to handle clearing patient data
  const handleClearPatient = () => {
    setFormData((prev) => ({
      ...prev,
      name: "",
      age: "",
      gender: "",
      guardian: "",
      location: "",
      patientId: null,
    }));

    // Focus on the input to open dropdown again
    setTimeout(() => {
      const inputElement = document.querySelector('input[name="patientName"]');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const formatSlotDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
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

  // Check if a date is today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleConfirmBooking = async () => {
    // Set form as submitted to trigger validation
    setFormData((prev) => ({ ...prev, formSubmitted: true }));

    // Check required fields
    if (
      !formData.selectedSlot ||
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.appointmentType
    ) {
      return;
    }

    setBookingLoading(true);
    setBookingStage(1); // Move stage change here after validation passes

    try {
      // Prepare appointment data according to API requirements
      const appointmentData = {
        cabinId: parseInt(doctorId),
        slot: formData.selectedSlot || cabinInfo?.slots?.[0]?.slot,
        name: formData.name,
        disease: formData.healthIssue || "",
        appointment_type: formData.appointmentType,
        phone_number: userData.user?.phone_number || "",
        age: String(formData.age),
        gender: formData.gender,
        location: formData.location || "",
        guardian: formData.guardian || "",
        fees_paid: 0,
        mode: "",
        paid: false,
        checkin: false,
        patient_id: formData.patientId,
      };

      // Call the API to save appointment
      const response = await addAppointment(appointmentData);
      console.log("Appointment saved:", response);

      // Store the appointment response for the confirmation dialog
      setAppointmentResponse(response);

      // Update user object with new appointment
      const updatedUser = {
        ...userData,
        current_appointments: [
          response,
          ...(userData.current_appointments || []),
        ],
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update context
      setUser(updatedUser);

      setBookingLoading(false);
      setBookingStage(2); // Success stage
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingLoading(false);
      setBookingStage(0); // Reset to initial stage on error

      // Check if this is the maximum appointments error (429 status code)
      if (error.response && error.response.status === 429) {
        setSnackbar({
          open: true,
          message: error.response.data.detail,
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to book appointment. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleNavigateToHome = () => {
    setShowBookingDialog(false);
    setBookingStage(0);
    navigate("/patient-home?appointmentBooked=true");
  };

  const handlePatientTypeChange = (event) => {
    setPatientType(event.target.value);
  };

  const handleFamilyMemberChange = (field, value) => {
    setFamilyMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCall = () => {
    window.open(`tel:${doctor.phone}`);
  };

  const handleDirections = () => {
    const coordinates = doctor.address.split(",");
    const lat = coordinates[0].trim();
    const long = coordinates[1].trim();
    const address = `${lat},${long}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          pb: 10,
          bgcolor: "#f9fafc",
          height: "calc(100vh - 180px)",
          overflowY: "auto",
        }}
      >
        {/* Back Button */}
        <BackButton />

        {/* Doctor Information Card Skeleton */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 2,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Header with specialty skeleton */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#f0f7ff",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Skeleton variant="rounded" width={150} height={32} />
          </Box>

          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <Skeleton variant="circular" width={80} height={80} />
              </Grid>

              <Grid item xs>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={40}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={24}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  width={150}
                  height={30}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="60%" height={24} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={6} sm={3} key={item}>
                  <Box sx={{ textAlign: "center" }}>
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ mx: "auto", mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={24}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Skeleton
              variant="rounded"
              width="100%"
              height={48}
              sx={{ mt: 2, borderRadius: 2 }}
            />
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Box sx={{ p: 1, display: "flex" }}>
            <Skeleton
              variant="rounded"
              width={120}
              height={40}
              sx={{ mr: 2 }}
            />
            <Skeleton variant="rounded" width={120} height={40} />
          </Box>
        </Box>

        {/* Tab Content Skeleton */}
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />

          <Divider sx={{ my: 2 }} />

          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
          <Stack spacing={1}>
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={160}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        pb: 16,
        bgcolor: "#f9fafc",
        height: "calc(100vh - 180px)",
        overflowY: "auto",
      }}
    >
      {/* Back Button */}
      <BackButton />

      {/* Doctor Information Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 2,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header with specialty */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#f0f7ff",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Chip
            icon={<MedicalServicesIcon fontSize="small" />}
            label={doctor.specialty}
            color="primary"
            size="medium"
            sx={{ fontWeight: 500, fontSize: "0.9rem", py: 0.5 }}
          />
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {doctor.name.charAt(0)}
              </Avatar>
            </Grid>

            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Dr. {doctor.name}
              </Typography>

              {/* Rating stars - commented out
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Rating 
            value={doctor.rating}
            precision={0.1}
            size="small"
            readOnly 
            sx={{ mr: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
            {doctor.rating}• {doctor.reviews} reviews
        </Typography>
        </Box>
        */}

              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip
                  label={`Experience: ${doctor.experience} years`}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
                />
                {/* <Chip
            icon={<PersonIcon fontSize="small" />}
            label="English, Hindi"
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
        /> */}
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ mr: 0.5, color: "text.disabled" }}
                  />
                  {doctor.clinic}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Next Available
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{
                    color:
                      doctor.currentStatus === "Available"
                        ? "success.main"
                        : cabinInfo?.next_active
                        ? "success.main"
                        : "text.secondary",
                  }}
                >
                  {doctor.currentStatus === "Available"
                    ? "Now"
                    : cabinInfo?.next_active
                    ? formatNextAvailable(cabinInfo?.next_active)
                    : "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Consultation Fee
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="primary">
                  {doctor.fees} (pay at clinic)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Warning for no slots */}
      {slots.length === 0 && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: "rgba(255, 152, 0, 0.05)",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Not accepting online bookings currently
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
          }}
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          {/* Reviews Tab - commented out
        <Tab 
            label="Reviews"
            icon={<StarIcon />}
            iconPosition="start" />
        */}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box
        sx={{
          bgcolor: "white",
          p: 2,
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Profile Tab */}
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {doctor.about}
            </Typography>

            {/* <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                Education & Experience
                </Typography>
                <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <SchoolIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.education}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <MedicalServicesIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.experience} of experience
                </Typography>
                </Stack> */}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Clinic Information
            </Typography>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LocationOnIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                {doctor.clinic}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <PhoneIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  {doctor.phone}
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhoneIcon />}
                    onClick={handleCall}
                    sx={{
                      mr: 1,
                      borderRadius: 2,
                      height: "32px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DirectionsIcon />}
                    onClick={handleDirections}
                    sx={{ borderRadius: 2, height: "32px", fontSize: "0.8rem" }}
                  >
                    Map
                  </Button>
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <MonetizationOnIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "primary.main" }}
                />
                {doctor.fees} Consultation Fee
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Clinic Timings
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ border: "1px solid rgba(0,0,0,0.1)" }}
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Monday
                    </TableCell>
                    <TableCell>{doctor.timings.mon}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Tuesday
                    </TableCell>
                    <TableCell>{doctor.timings.tue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Wednesday
                    </TableCell>
                    <TableCell>{doctor.timings.wed}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Thursday
                    </TableCell>
                    <TableCell>{doctor.timings.thu}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Friday
                    </TableCell>
                    <TableCell>{doctor.timings.fri}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Saturday
                    </TableCell>
                    <TableCell>{doctor.timings.sat}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 500 }}>
                      Sunday
                    </TableCell>
                    <TableCell>{doctor.timings.sun}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Reviews Tab */}
        {selectedTab === 1 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Patient Reviews
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgba(255,193,7,0.1)",
                  p: 0.5,
                  px: 1,
                  borderRadius: 1,
                }}
              >
                <StarIcon
                  fontSize="small"
                  sx={{ color: "warning.main", mr: 0.5 }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {doctor.rating}• {doctor.reviews} reviews
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              {reviewData.map((review, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ borderRadius: 2, boxShadow: "none" }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={500}>
                        {review.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.date}
                      </Typography>
                    </Box>

                    <Rating
                      value={review.rating}
                      size="small"
                      readOnly
                      sx={{ mb: 1 }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {review.review}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Write a review
            </Button>
          </Box>
        )}
      </Box>

      {/* Booking Dialog */}
      <Dialog
        open={showBookingDialog}
        onClose={handleCloseDialog}
        fullScreen
        PaperProps={{
          sx: {
            overflowY: "auto",
            bgcolor: "#f9fafc",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            px: 3,
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            {bookingStage === 0 && "Book Appointment"}
            {bookingStage === 1 && "Processing"}
            {bookingStage === 2 && "Appointment Confirmed"}
          </Typography>
        </Box>

        <Box sx={{ p: 3, mb: 10 }}>
          {bookingStage === 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Booking Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo={true}
                    options={patients}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    onChange={handlePatientSelect}
                    onInputChange={handlePatientInputChange}
                    clearOnBlur={false}
                    value={formData.name ? formData.name : null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient Name"
                        required
                        fullWidth
                        size="small"
                        name="patientName"
                        error={!formData.name && formData.formSubmitted}
                        helperText={
                          !formData.name && formData.formSubmitted
                            ? "Patient name is required"
                            : ""
                        }
                        inputProps={{
                          ...params.inputProps,
                          style: { textTransform: "uppercase" },
                        }}
                        onChange={(e) => {
                          // Handle uppercase conversion during typing
                          const value = e.target.value.toUpperCase();
                          handleFormChange("name", value);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Select Slot"
                    value={formData.selectedSlot}
                    onChange={(e) =>
                      handleFormChange("selectedSlot", e.target.value)
                    }
                    required
                    size="small"
                    select
                    error={!formData.selectedSlot && formData.formSubmitted}
                    helperText={
                      !formData.selectedSlot && formData.formSubmitted
                        ? "Please select a slot"
                        : ""
                    }
                  >
                    {slots.length > 0 ? (
                      slots.map((slot, index) => (
                        <MenuItem key={index} value={slot.slot}>
                          {slot.is_active && isToday(slot.slot) ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "success.main",
                                fontWeight: "bold",
                              }}
                            >
                              Current Slot ({formatSlotDateTime(slot.slot)})
                            </Box>
                          ) : (
                            formatSlotDateTime(slot.slot)
                          )}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No slots available currently</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleFormChange("age", e.target.value)}
                    required
                    size="small"
                    error={!formData.age && formData.formSubmitted}
                    helperText={
                      !formData.age && formData.formSubmitted
                        ? "Age is required"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={formData.gender}
                    onChange={(e) => handleFormChange("gender", e.target.value)}
                    required
                    size="small"
                    select
                    error={!formData.gender && formData.formSubmitted}
                    helperText={
                      !formData.gender && formData.formSubmitted
                        ? "Gender is required"
                        : ""
                    }
                  >
                    <MenuItem value="" disabled>
                      Select Gender
                    </MenuItem>
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Appointment Type"
                    value={formData.appointmentType}
                    onChange={(e) =>
                      handleFormChange("appointmentType", e.target.value)
                    }
                    required
                    size="small"
                    select
                    error={!formData.appointmentType && formData.formSubmitted}
                    helperText={
                      !formData.appointmentType && formData.formSubmitted
                        ? "Appointment type is required"
                        : ""
                    }
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Follow-up">Follow-up</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Accordion
                    elevation={0}
                    sx={{
                      mt: 1,
                      "&:before": { display: "none" },
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        Additional Information (Optional)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Guardian Name"
                            value={formData.guardian}
                            onChange={(e) =>
                              handleFormChange("guardian", e.target.value)
                            }
                            size="small"
                            InputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            value={formData.location}
                            onChange={(e) =>
                              handleFormChange("location", e.target.value)
                            }
                            size="small"
                            InputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Health Issue"
                            value={formData.healthIssue}
                            onChange={(e) =>
                              handleFormChange("healthIssue", e.target.value)
                            }
                            multiline
                            rows={2}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 4 }}>
                Doctor Details
              </Typography>

              <Card
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, mb: 1 }}
                      >
                        <Box
                          component="span"
                          sx={{ color: "text.secondary", fontWeight: 400 }}
                        >
                          Doctor Name:
                        </Box>{" "}
                        Dr. {doctor.name}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, mb: 1 }}
                      >
                        <Box
                          component="span"
                          sx={{ color: "text.secondary", fontWeight: 400 }}
                        >
                          Doctor Specialty:
                        </Box>{" "}
                        {doctor.specialty}
                      </Typography>

                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        <Box
                          component="span"
                          sx={{ color: "text.secondary", fontWeight: 400 }}
                        >
                          Clinic Name:
                        </Box>{" "}
                        {doctor.clinic}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 2 }}
              >
                By confirming this appointment, you agree to our terms and
                conditions.
              </Typography>
            </>
          )}

          {bookingStage === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Processing your appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait, we're confirming your appointment...
              </Typography>
            </Box>
          )}

          {bookingStage === 2 && appointmentResponse && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
                px: 1,
              }}
            >
              {/* Success animation container */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  boxShadow: "0 10px 20px rgba(46, 125, 50, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
                    borderRadius: "50%",
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  ✓
                </Typography>
              </Box>

              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1976d2, #2196f3)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Appointment Confirmed!
              </Typography>

              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 450, mx: "auto" }}
              >
                Your appointment has been successfully booked with Dr.{" "}
                {cabinInfo?.doctor?.name || "the doctor"}
              </Typography>

              <Box sx={{ width: "100%", mt: 1, maxWidth: "500px", mx: "auto" }}>
                {/* Token number card */}
                <Card
                  elevation={3}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  {/* Removed appointment details header */}

                  <CardContent sx={{ pt: 3, pb: 3 }}>
                    {/* Token number section - commented out
                    <Box sx={{ 
                      textAlign: 'center', 
                      mb: 3, 
                      mt: 1, 
                      py: 1.5,
                      bgcolor: 'rgba(25, 118, 210, 0.05)', 
                      borderRadius: 2 
                    }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        YOUR TOKEN NUMBER
                      </Typography>
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                        #{appointmentResponse.token}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2.5 }} />
                    */}

                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <PersonIcon
                            sx={{ color: "primary.main", mr: 1.5, mt: 0.3 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.3 }}
                            >
                              PATIENT
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {appointmentResponse.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <EventIcon
                            sx={{ color: "primary.main", mr: 1.5, mt: 0.3 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.3 }}
                            >
                              BOOKED SLOT
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {formatSlotDateTime(
                                appointmentResponse.cabinslot.slot
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <MedicalServicesIcon
                            sx={{ color: "primary.main", mr: 1.5, mt: 0.3 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.3 }}
                            >
                              APPOINTMENT TYPE
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {appointmentResponse.appointment_type}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {appointmentResponse.disease && (
                        <Grid item xs={12}>
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <HealthAndSafetyIcon
                              sx={{ color: "primary.main", mr: 1.5, mt: 0.3 }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mb: 0.3 }}
                              >
                                HEALTH ISSUE
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {appointmentResponse.disease}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <LocationOnIcon
                            sx={{ color: "primary.main", mr: 1.5, mt: 0.3 }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.3 }}
                            >
                              CLINIC
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {doctor.clinic}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Instructions Card */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    borderColor: !appointmentResponse.queobj.paid
                      ? "warning.main"
                      : "primary.main",
                    bgcolor: !appointmentResponse.queobj.paid
                      ? "warning.lighter"
                      : "primary.lighter",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      bgcolor: !appointmentResponse.queobj.paid
                        ? "warning.main"
                        : "primary.main",
                    }}
                  />

                  <CardContent sx={{ pl: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {!appointmentResponse.queobj.paid ? (
                        <InfoIcon sx={{ color: "warning.main", mr: 1 }} />
                      ) : (
                        <CheckCircleIcon
                          sx={{ color: "primary.main", mr: 1 }}
                        />
                      )}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: !appointmentResponse.queobj.paid
                            ? "warning.dark"
                            : "primary.dark",
                        }}
                      >
                        {!appointmentResponse.queobj.paid
                          ? "PAYMENT REQUIRED"
                          : "IMPORTANT INFORMATION"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: !appointmentResponse.queobj.paid
                          ? "warning.dark"
                          : "primary.dark",
                        opacity: 0.9,
                        pl: 4,
                      }}
                    >
                      Please arrive at the clinic on time.
                      {!appointmentResponse.queobj.paid &&
                        " Remember to complete the payment at the reception desk when you arrive."}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Removed "details have been saved" message */}
              </Box>
            </Box>
          )}
        </Box>

        {/* Fixed bottom buttons */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: "white",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
            zIndex: 1,
          }}
        >
          {bookingStage === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCloseDialog}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  onClick={handleConfirmBooking}
                  fullWidth
                  disabled={slots.length === 0}
                  sx={{ borderRadius: 2, py: 1.2 }}
                >
                  {slots.length > 0 ? "Complete Booking" : "No Slots Available"}
                </Button>
              </Grid>
            </Grid>
          )}

          {bookingStage === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleNavigateToHome}
                  sx={{ borderRadius: 2, py: 1.2 }}
                >
                  Go to Home
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Dialog>

      {/* Sticky Book Appointment Button */}
      {!showBookingDialog && slots.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            backgroundColor: "transparent",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              maxWidth: "500px",
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(25,118,210,0.4)",
              },
              fontSize: "1rem",
              fontWeight: 500,
            }}
            onClick={handleBookNow}
          >
            Book Appointment
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorPage;
