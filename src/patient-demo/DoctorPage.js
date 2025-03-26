import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MessageIcon from "@mui/icons-material/Message";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
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
  Typography
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
        severity: "error"
    });

    const [cabinInfo, setCabinInfo] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "M",
        guardian: "",
        location: "",
        healthIssue: "",
        appointmentType: "New",
        selectedSlot: null,
        patientId: null
    });

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const patients = userData.patients || [];
    const slots = cabinInfo?.slots || [];

    const { user, setUser } = useContext(AuthContext);
    const [appointmentResponse, setAppointmentResponse] = useState(null);

    useEffect(() => {
        const fetchCabinInfo = async() => {
            try {
                const response = await getCabinInfo(doctorId);
                console.log("API Response:", response);
                setCabinInfo(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cabin info:", error);
            }
        };

        fetchCabinInfo();
    }, [doctorId]);

    // Transform cabinInfo into doctor object with fallbacks
    const doctor = {
        id: cabinInfo?.id || parseInt(doctorId),
        name: cabinInfo?.doctor?.name || "Dr. Rahul Gupta",
        specialty: cabinInfo?.doctor?.specialization || "Skin Specialist",
        clinic: cabinInfo?.hospital?.hospital_name || "Gupta Skin and dental clinic",
        address: cabinInfo?.hospital?.map_location || "Station Road, Alwar, Rajasthan",
        rating: parseFloat(cabinInfo?.doctor?.rating) || 4.7,
        reviews: 543, // Fallback since not in API
        experience: `${cabinInfo?.doctor?.experience || 15} years`,
        education: "MBBS, MD (General Medicine)", // Fallback since not in API
        about: `Dr. ${cabinInfo?.doctor?.name || "Rahul Gupta"} is a highly experienced with over ${cabinInfo?.doctor?.experience || 15} years of practice. Dr. ${cabinInfo?.doctor?.name || "Rahul Gupta"} is known for his patient-centric approach and dedication to providing personalized care.`, // Fallback since not in API
        timings: {
            mon: "9:00 AM - 1:00 PM",
            tue: "9:00 AM - 1:00 PM",
            wed: "9:00 AM - 1:00 PM",
            thu: "4:00 PM - 8:00 PM",
            fri: "4:00 PM - 8:00 PM",
            sat: "9:00 AM - 1:00 PM",
        }, // Fallback since not in API
        fees: `₹${cabinInfo?.fees || 500}`,
        currentToken: 8, // Fallback since not in API
        yourToken: 15, // Fallback since not in API
        estimatedWaitTime: "1hr 27 mins", // Fallback since not in API
        phone: cabinInfo?.doctor?.phone_number || "---",
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

    const reviewData = [{
            name: "Rahul Sharma",
            date: "12 Apr 2023",
            rating: 5,
            review: "Excellent doctor! Very knowledgeable and took time to explain my skin condition. The prescribed treatment worked well for me.",
        },
        {
            name: "Priya Patel",
            date: "28 Mar 2023",
            rating: 4,
            review: "Good experience overall. Waited a bit longer than expected but the consultation was thorough and helpful.",
        },
        {
            name: "Amit Kumar",
            date: "15 Mar 2023",
            rating: 5,
            review: "Dr. Gupta is very professional and friendly. He addressed all my concerns and the treatment was effective. Highly recommend!",
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
            gender: "M",
        });
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePatientSelect = (event, value) => {
        if (value) {
            if (typeof value === 'string') {
                // Handle freeSolo input
                setFormData(prev => ({
                    ...prev,
                    name: value,
                    patientId: null
                }));
            } else {
                // Handle selection from options
                setFormData(prev => ({
                    ...prev,
                    name: value.name,
                    age: value.age || "",
                    gender: value.gender || "M",
                    guardian: value.guardian || "",
                    location: value.location || "",
                    patientId: value.patient_id
                }));
            }
        }
    };

    const formatSlotDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        // Adjust for timezone offset
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

        const day = adjustedDate.getDate().toString().padStart(2, '0');
        const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = adjustedDate.getFullYear();
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');

        return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
    };

    const handleConfirmBooking = async() => {
        setBookingLoading(true);

        try {
            // Prepare appointment data according to API requirements
            const appointmentData = {
                cabinId: parseInt(doctorId),
                slot: formData.selectedSlot || cabinInfo?.slots?.[0]?.slot,
                name: formData.name,
                disease: formData.healthIssue || "",
                appointment_type: formData.appointmentType,
                phone_number: userData.user?.phone_number || "",
                age: formData.age,
                gender: formData.gender,
                location: formData.location || "",
                guardian: formData.guardian || "",
                fees_paid: cabinInfo?.fees || 0,
                mode: "",
                paid: false,
                checkin: false,
                patient_id: formData.patientId
            };

            // Call the API to save appointment
            const response = await addAppointment(appointmentData);
            console.log("Appointment saved:", response);

            // Store the appointment response for the confirmation dialog
            setAppointmentResponse(response);

            // Update user object with new appointment
            const updatedUser = {
                ...userData,
                current_appointments: [response, ...(userData.current_appointments || [])]
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
            setSnackbar({
                open: true,
                message: "Failed to book appointment. Please try again.",
                severity: "error"
            });
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
        setFamilyMember(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCall = () => {
        window.open(`tel:${doctor.phone}`);
    };

    const handleDirections = () => {
        window.open(`https://maps.google.com/?q=${doctor.address}`);
    };

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(90vh)",
                overflowY: "auto",
                mb: 10
            }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
            Loading doctor profile...
            </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, pb: 10, bgcolor: "#f9fafc", height: "calc(100vh - 180px)", overflowY: "auto" }}>
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
                overflow: "hidden"
            }}>
        {/* Header with specialty */}
        <Box sx={{ p: 2, bgcolor: "#f0f7ff", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Chip 
            icon={<MedicalServicesIcon fontSize="small" />}
            label={doctor.specialty}
            color="primary"
            size="medium"
            sx={{ fontWeight: 500, fontSize: '0.9rem', py: 0.5 }}
        />
        </Box>

        <CardContent>
        <Grid container spacing={2}>
        <Grid item>
        <Avatar sx={{
            bgcolor: "primary.main",
            width: 80,
            height: 80,
            fontSize: "2rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
        }}>
        {doctor.name.charAt(0)}
        </Avatar>
        </Grid>

        <Grid item xs>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Dr. {doctor.name}
        </Typography>

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

        <Stack 
            direction="row"
            spacing={2}
            sx={{ mb: 1 }}>
        <Chip 
            icon={<SchoolIcon fontSize="small" />}
            label={doctor.experience}
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

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnIcon 
            fontSize="small"
            sx={{ mr: 0.5, color: "text.disabled" }}
        /> 
        {doctor.clinic}, {doctor.address}
        </Typography>
        </Box>
        </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
        <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" display="block">
        Current Status
        </Typography>
        <Typography variant="body2" fontWeight="medium" color="primary">
        Accepting Patients
        </Typography>
        </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
        <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" display="block">
        Wait Time
        </Typography>
        <Typography variant="body2" fontWeight="medium" color="primary">
        {doctor.estimatedWaitTime}
        </Typography>
        </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
        <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" display="block">
        Consultation Fee
        </Typography>
        <Typography variant="body2" fontWeight="medium" color="primary">
        {doctor.fees}
        </Typography>
        </Box>
        </Grid>

        <Grid item xs={6} sm={3}>
        <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary" display="block">
        Total Patient
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" fontWeight="medium" color="primary.dark">
        {615}
        </Typography>
        {/* <Chip
            label="Active"
            size="small"
            color="success"
            sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
        /> */}
        </Box>
        </Box>
        </Grid>
        </Grid>

        <Button 
            variant="contained"
            fullWidth 
            sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                "&:hover": {
                    boxShadow: "0 6px 16px rgba(25,118,210,0.4)",
                }
            }}
            onClick={handleBookNow}>
        Book Appointment
        </Button>
        </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", borderRadius: "12px 12px 0 0" }}>
        <Tabs 
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 }
            }}>
        <Tab 
            label="Profile"
            icon={<PersonIcon />}
            iconPosition="start" />
        <Tab 
            label="Reviews"
            icon={<StarIcon />}
            iconPosition="start" />
        </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ bgcolor: "white", p: 2, borderRadius: "0 0 12px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        {/* Profile Tab */}
        {selectedTab === 0 && (
                <Box>
                <Typography variant="h6" gutterBottom>
                About
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                {doctor.about}
                </Typography>

                <Divider sx={{ my: 2 }} />

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
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                Clinic Information
                </Typography>
                <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.clinic}, {doctor.address}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.phone}
                </Typography>
                <Box>
                <Button variant="outlined" size="small" startIcon={<PhoneIcon />} onClick={handleCall} sx={{ mr: 1, borderRadius: 2, height: '32px', fontSize: '0.8rem' }}>
                Call
                </Button>
                <Button variant="outlined" size="small" startIcon={<DirectionsIcon />} onClick={handleDirections} sx={{ borderRadius: 2, height: '32px', fontSize: '0.8rem' }}>
                Map
                </Button>
                </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.fees} Consultation Fee
                </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                Clinic Timings
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                <Table size="small">
                <TableBody>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Monday</TableCell>
                <TableCell>{doctor.timings.mon}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Tuesday</TableCell>
                <TableCell>{doctor.timings.tue}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Wednesday</TableCell>
                <TableCell>{doctor.timings.wed}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Thursday</TableCell>
                <TableCell>{doctor.timings.thu}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Friday</TableCell>
                <TableCell>{doctor.timings.fri}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Saturday</TableCell>
                <TableCell>{doctor.timings.sat}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell component="th" sx={{ fontWeight: 500 }}>Sunday</TableCell>
                <TableCell>Closed</TableCell>
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
                <Box sx={{ display: "flex", alignItems: "center", bgcolor: "rgba(255,193,7,0.1)", p: 0.5, px: 1, borderRadius: 1 }}>
                <StarIcon fontSize="small" sx={{ color: "warning.main", mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                {doctor.rating}• {doctor.reviews} reviews
                </Typography>
                </Box>
                </Box>

                <Stack spacing={2}>
                {reviewData.map((review, index) => (
                    <Card key={index} variant="outlined" sx={{ borderRadius: 2, boxShadow: "none" }}>
                    <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                    {review.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                    {review.date}
                    </Typography>
                    </Box>

                    <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />

                    <Typography variant="body2" color="text.secondary">
                    {review.review}
                    </Typography>
                    </CardContent>
                    </Card>
                ))}
                </Stack>

                <Button variant="outlined" startIcon={<MessageIcon />} fullWidth sx={{ mt: 2, borderRadius: 2 }}>
                Write a review
                </Button>
                </Box>
            )}
        </Box>

         {/* Booking Dialog */}
         <Dialog 
             open={showBookingDialog} 
             onClose={handleCloseDialog} 
             PaperProps={{
                sx: { borderRadius: 3, maxWidth: 500 }
             }}>
         <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 1.5, px: 3, position: 'relative' }}>
         <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
             {bookingStage === 0 && "Book Appointment"}
             {bookingStage === 1 && "Processing"}
             {bookingStage === 2 && "Appointment Confirmed"}
         </DialogTitle>
         {bookingStage === 0 && (
             <IconButton 
                 onClick={handleCloseDialog} 
                 sx={{
                     position: 'absolute',
                     right: 8,
                     top: '50%',
                     transform: 'translateY(-50%)',
                     color: 'white'
                 }}>
             <CloseIcon />
             </IconButton>
         )}
         </Box>

         <DialogContent>
         {bookingStage === 0 && (
             <>
             {/* <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                     Appointment Details
                   </Typography> */}
             <Grid container spacing={2} sx={{ mb: 1 }}>
             <Grid item xs={6}>
             <Typography variant="body2" color="text.secondary">
             Doctor
             </Typography>
             <Typography variant="body1" fontWeight={500}>
             {doctor.name}
             </Typography>
             </Grid>
             {/* <Grid item xs={6}>
                     <Typography variant="body2" color="text.secondary">
                       Specialty
                     </Typography>
                     <Typography variant="body1" fontWeight={500}>
                       {doctor.specialty}
                     </Typography>
                   </Grid> */}
             {/* <Grid item xs={6}>
                     <Typography variant="body2" color="text.secondary">
                       Date
                     </Typography>
                     <Typography variant="body1" fontWeight={500}>
                       {days[selectedDay].date}
                     </Typography>
                   </Grid> */}
             {/* <Grid item xs={6}>
                     <Typography variant="body2" color="text.secondary">
                       Current Queue
                     </Typography>
                     <Typography variant="body1" fontWeight={500}>
                       Token #{doctor.currentToken}
                     </Typography>
                   </Grid> */}
             <Grid item xs={6}>
             <Typography variant="body2" color="text.secondary">
             Clinic
             </Typography>
             <Typography variant="body1" fontWeight={500}>
             {doctor.clinic}
             </Typography>
             </Grid>
             <Grid item xs={6}>
             <Typography variant="body2" color="text.secondary">
             Fees
             </Typography>
             <Typography variant="body1" fontWeight={500}>
             {doctor.fees}
             </Typography>
             </Grid>
             </Grid>

             <Divider sx={{ my: 2 }} />

             <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
             Patient Information
             </Typography>

             <Grid container spacing={2}>
             <Grid item xs={12}>
             <Autocomplete 
                 freeSolo={true} 
                 options={patients} 
                 getOptionLabel={(option) => typeof option === 'string' ? option : option.name} 
                 onChange={handlePatientSelect} 
                 onInputChange={(event, value) => {
                     if (value) {
                         handlePatientSelect(event, value);
                     }
                 }} 
                 renderInput={(params) => (
                     <TextField {...params} label="Patient Name" required fullWidth size="small" />
                 )} 
             />
             </Grid>

             <Grid item xs={12} sm={6}>
             <TextField 
                 fullWidth 
                 label="Age" 
                 type="number" 
                 value={formData.age} 
                 onChange={(e) => handleFormChange('age', e.target.value)} 
                 required 
                 size="small" 
             />
             </Grid>

             <Grid item xs={12} sm={6}>
             <TextField 
                 fullWidth 
                 label="Gender" 
                 value={formData.gender} 
                 onChange={(e) => handleFormChange('gender', e.target.value)} 
                 required 
                 size="small" 
                 select
             >
             <MenuItem value="M">Male</MenuItem>
             <MenuItem value="F">Female</MenuItem>
             <MenuItem value="O">Other</MenuItem>
             </TextField>
             </Grid>

             <Grid item xs={12}>
             <TextField 
                 fullWidth 
                 label="Guardian" 
                 value={formData.guardian} 
                 onChange={(e) => handleFormChange('guardian', e.target.value)} 
                 size="small" 
             />
             </Grid>

             <Grid item xs={12}>
             <TextField 
                 fullWidth 
                 label="Location" 
                 value={formData.location} 
                 onChange={(e) => handleFormChange('location', e.target.value)} 
                 size="small" 
             />
             </Grid>

             <Grid item xs={12}>
             <TextField 
                 fullWidth 
                 label="Health Issue" 
                 value={formData.healthIssue} 
                 onChange={(e) => handleFormChange('healthIssue', e.target.value)} 
                 multiline 
                 rows={2} 
                 size="small" 
             />
             </Grid>

             <Grid item xs={12} sm={6}>
             <TextField 
                 fullWidth 
                 label="Appointment Type" 
                 value={formData.appointmentType} 
                 onChange={(e) => handleFormChange('appointmentType', e.target.value)} 
                 required 
                 size="small" 
                 select
             >
             <MenuItem value="New">New</MenuItem>
             <MenuItem value="Follow-up">Follow-up</MenuItem>
             </TextField>
             </Grid>

             <Grid item xs={12} sm={6}>
             <TextField 
                 fullWidth 
                 label="Select Slot" 
                 value={formData.selectedSlot} 
                 onChange={(e) => handleFormChange('selectedSlot', e.target.value)} 
                 required 
                 size="small" 
                 select
             >
             {slots.map((slot, index) => (
                 <MenuItem key={index} value={slot.slot}>
                 {formatSlotDateTime(slot.slot)}
                 </MenuItem>
             ))}
             </TextField>
             </Grid>
             </Grid>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                By confirming this appointment, you agree to our terms and conditions.
              </Typography>
            </>
          )}
          
          {bookingStage === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Processing your appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait, we're confirming your appointment...
              </Typography>
            </Box>
          )}
          
          {bookingStage === 2 && appointmentResponse && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Typography variant="h4" sx={{ color: 'white' }}>✓</Typography>
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Your appointment has been confirmed!
              </Typography>
              
              <Box sx={{ width: '100%', mt: 2 }}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Appointment ID
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {appointmentResponse.appointment_id}
                        </Typography>
                      </Grid> */}
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Patient Name
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {appointmentResponse.name}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Token Number
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          #{appointmentResponse.token}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Appointment Type
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {appointmentResponse.appointment_type}
                        </Typography>
                      </Grid>
                      
                      {/* <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Consultation Fee
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          ₹{appointmentResponse.fees_paid}
                        </Typography>
                      </Grid> */}
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Appointment Slot
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {formatSlotDateTime(appointmentResponse.cabinslot.slot)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Hospital
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {appointmentResponse.cabinslot.cabin.hospital.hospital_name}
                        </Typography>
                      </Grid>
                      
                      {appointmentResponse.disease && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Health Issue
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {appointmentResponse.disease}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

             <Box sx={{
                 bgcolor: 'primary.light',
                 p: 2,
                 borderRadius: 2,
                 color: 'primary.contrastText'
             }}>
             <Typography variant="body2" align="center">
             Please arrive at the clinic before your token number is called. 
             {!appointmentResponse.queobj.paid && (
                 " Remember to complete the payment at the reception."
             )}
             </Typography>
             </Box>
             </Box>
             </Box>
         )}
         </DialogContent>

         <DialogActions sx={{ px: 3, pb: 3 }}>
         {bookingStage === 0 && (
             <Button 
                 variant="contained" 
                 onClick={() => {
                     setBookingStage(1);
                     handleConfirmBooking();
                 }} 
                 fullWidth
             >
             Complete Booking
             </Button>
         )}

         {bookingStage === 2 && (
             <Button variant="contained" fullWidth onClick={handleNavigateToHome}>
             Go to Home
             </Button>
         )}
         </DialogActions>
         </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(prev => ({...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({...prev, open: false }))}>
        {snackbar.message}
        </Alert>
        </Snackbar>
        </Box>
    );
};

export default DoctorPage;