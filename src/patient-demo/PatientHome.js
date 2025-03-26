import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import QueueIcon from "@mui/icons-material/Queue";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AuthContext } from "../context/AuthContext";

const PatientHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);
    const [hasAppointment, setHasAppointment] = useState(false);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const { user } = useContext(AuthContext);
    const currentAppointments = user?.current_appointments || [];
    const newAppointments = currentAppointments.filter(app => app.queobj?.status === "pending");

    // Get patient details from localStorage
    const getPatientDetails = (patientId) => {
        try {
            const userDataString = localStorage.getItem('user');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const patients = userData.patients || [];
                return patients.find(patient => patient.patient_id === patientId) || null;
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
        return null;
    };
    const appointmentsList = newAppointments.map(appointment => ({
        id: appointment.appointment_id,
        doctor: appointment.cabinslot?.cabin?.doctor?.name || "Doctor",
        date: appointment.cabinslot?.slot,
        status: appointment.queobj?.status || "pending",
        clinic: appointment.cabinslot?.cabin?.hospital?.hospital_name || "Hospital",
        specialty: appointment.cabinslot?.cabin?.doctor?.specialization || "Specialist",
        token: appointment.token,
        currentToken: appointment.queobj?.position || 1,
        estimatedWaitTime: "30 minutes", // Dummy value for expected time
        patientId: appointment.patient_id || "P12345",
        location: appointment.patient?.location || "Not specified",
        appointmentType: appointment.appointment_type || "New",
        disease: appointment.disease || "Not specified",
        patientFor: appointment.name,
        phone: appointment.cabinslot?.cabin?.doctor?.phone_number || "",
        age: appointment.patient?.age,
        gender: appointment.patient?.gender,
        doctorPhone: appointment.cabinslot?.cabin?.doctor?.phone_number,
        hospitalPhone: appointment.cabinslot?.cabin?.hospital?.phone_number,
        fees: appointment.cabinslot?.cabin?.fees || 0,
        feesPaid: appointment.fees_paid || 0,
        paid: appointment?.queobj?.paid,
        checkin: appointment.queobj?.checkin || false,
        late: appointment.queobj?.late || false,
        mode: appointment.mode,
        cabinId: appointment.cabinslot?.cabin?.id ||-1
    }));

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => 
            prevActiveStep === appointmentsList.length - 1 ? 0 : prevActiveStep + 1
        );
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => 
            prevActiveStep === 0 ? appointmentsList.length - 1 : prevActiveStep - 1
        );
    };

    useEffect(() => {
        // Check if we should show appointment based on URL param or existing appointments
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('appointmentBooked') === 'true' || location.state?.bookingSuccess) {
            setHasAppointment(true);
            setLoading(true);
            setShowBookingSuccess(true);

            // Simulate loading
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1500);

            // Clear success message after some time
            const successTimer = setTimeout(() => {
                setShowBookingSuccess(false);
            }, 4000);

            return () => {
                clearTimeout(timer);
                clearTimeout(successTimer);
            };
        } else if (appointmentsList.length > 0) {
            setHasAppointment(true);
        }
    }, [location, appointmentsList]);

    // Format date to DD/MM/YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return "Not specified";
        const date = new Date(dateStr);
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

    const handleViewDetails = (appointment) => {
        // Get detailed patient information from localStorage
        const patientDetails = getPatientDetails(appointment.patientId);
        // Merge patient details with appointment
        const appointmentWithPatientDetails = {
            ...appointment,
            // Override with patient details from localStorage if available
            patientFor: patientDetails?.name,
            age: patientDetails?.age,
            gender: patientDetails?.gender,
            location: patientDetails?.location,
            phone: patientDetails?.phone_number,
            guardian: patientDetails?.guardian,
            allergies: patientDetails?.allergies
        };
        
        setSelectedAppointment(appointmentWithPatientDetails);
        setShowAppointmentDetails(true);
    };

    const handleCall = () => {
        window.open(`tel:${selectedAppointment?.doctorPhone}`);
    };

    const handleDirections = () => {
        window.open(`https://maps.google.com/?q=${selectedAppointment?.location}`);
    };

    return (
        <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 180px)", overflowY: "auto" }}>
            {/* Loading Overlay */}
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
                </Box>
            )}

            {/* Success Message */}
            {showBookingSuccess && !loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#4caf50',
                    color: 'white',
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    animation: 'slideIn 0.5s ease-out',
                    '@keyframes slideIn': {
                        '0%': {
                            transform: 'translate(-50%, -100%)',
                            opacity: 0
                        },
                        '100%': {
                            transform: 'translate(-50%, 0)',
                            opacity: 1
                        }
                    }
                }}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">Appointment booked successfully!</Typography>
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
                    <Card sx={{
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: '#eef2ff',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        },
                        '&:active': {
                            transform: 'translateY(-2px)',
                        }
                    }} onClick={() => navigate("/search")}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ bgcolor: '#4f46e5', mx: 'auto', mb: 1 }}>
                                <AddIcon />
                            </Avatar>
                            <Typography variant="body1" fontWeight="medium">
                                Book Appointment
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: '#f0fdf4',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        },
                        '&:active': {
                            transform: 'translateY(-2px)',
                        }
                    }} onClick={() => navigate("/appointments")}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ bgcolor: '#15803d', mx: 'auto', mb: 1 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                        Current Appointments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {appointmentsList.length > 0 ? `${activeStep + 1}/${appointmentsList.length}` : ''}
                    </Typography>
                </Box>

                {hasAppointment && appointmentsList.length > 0 ? (
                    <Box sx={{ position: 'relative' }}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation={false}
                            pagination={{ 
                                clickable: true
                            }}
                            onSlideChange={(swiper) => handleStepChange(swiper.activeIndex)}
                            style={{ 
                                borderRadius: 12, 
                                overflow: 'visible',
                                '--swiper-pagination-color': '#1976d2'
                            }}
                        >
                            {appointmentsList.map((appointment, index) => (
                                <SwiperSlide key={appointment.id}>
                                    <Box sx={{ px: 0.5, pb: 1 }}>
                                        <Card elevation={1} sx={{
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                            }
                                        }}>
                                            <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2 }}>
                                                <Typography variant="subtitle1" fontWeight="600">Dr. {appointment.doctor}</Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    {/* {appointment.specialty} • */} {appointment.clinic}
                                                </Typography>
                                            </Box>

                                            <CardContent>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                                                            <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>Slot:</strong> {formatDate(appointment.date)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>Patient Name:</strong> {appointment.patientFor}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                               <strong>PID:</strong> {appointment.patientId}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                            <QueueIcon color="primary" />
                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                Your Token
                                                            </Typography>
                                                            <Typography variant="h5" color="primary" fontWeight="bold">#{appointment.token}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={6}>
                                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                            <AccessTimeIcon color="primary" />
                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                Expected Time
                                                            </Typography>
                                                            <Typography variant="h5" color="primary" fontWeight="bold">
                                                                {appointment.estimatedWaitTime}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<PhoneIcon />}
                                                            sx={{ borderRadius: 2, mr: 1 }}
                                                            onClick={() => window.open(`tel:${appointment.doctorPhone}`)}
                                                        >
                                                            Call
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<DirectionsIcon />}
                                                            sx={{ borderRadius: 2 }}
                                                            onClick={() => window.open(`https://maps.google.com/?q=${appointment.clinic}`)}
                                                        >
                                                            Directions
                                                        </Button>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Button 
                                                            variant="contained" 
                                                            fullWidth 
                                                            sx={{
                                                                mt: 2,
                                                                borderRadius: 2,
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    transform: 'translateX(4px)'
                                                                }
                                                            }} 
                                                            onClick={() => handleViewDetails(appointment)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Grid>
                                                </Grid>
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
                                margin-top: 8px !important;
                                bottom: 0 !important;
                            }
                            .swiper-pagination-bullet {
                                width: 8px;
                                height: 8px;
                                margin: 0 4px;
                            }
                            .swiper-pagination-bullet-active {
                                background: #1976d2;
                            }
                            `}
                        </style>
                    </Box>
                ) : (
                    <Card elevation={1} sx={{
                        borderRadius: 3,
                        mb: 4,
                        p: 3,
                        bgcolor: '#fafafa',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }
                    }}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <EventBusyIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No New Appointments Scheduled
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                You don't have any new appointments in the queue.
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate("/search")} 
                                startIcon={<SearchIcon />} 
                                sx={{
                                    borderRadius: 2,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                    }
                                }}
                            >
                                Find a Doctor
                            </Button>
                        </Box>
                    </Card>
                )}
            </Box>

            {/* Popular Specialties */}
            <Typography variant="h6" fontWeight="600" gutterBottom>
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
                        }} onClick={() => navigate("/search")}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="body1">{specialty}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* <Button variant="contained" fullWidth startIcon={<SearchIcon />} onClick={() => navigate("/search")} sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                position: 'fixed',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 32px)',
                maxWidth: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                zIndex: 20,
                '&:hover': {
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    transform: 'translate(-50%, -2px)'
                },
                '&:active': {
                    transform: 'translate(-50%, 0)',
                }
            }}>
                Book New Appointment
            </Button> */}

            {/* Appointment Details Dialog */}
            <Dialog open={showAppointmentDetails} onClose={() => setShowAppointmentDetails(false)} fullWidth maxWidth="md" PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 1.5, px: 3, position: 'relative' }}>
                    <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
                        Appointment Details
                    </DialogTitle>
                    <IconButton 
                        aria-label="close" 
                        onClick={() => setShowAppointmentDetails(false)}
                        sx={{ 
                            position: 'absolute', 
                            right: 8, 
                            top: 8, 
                            color: 'white'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ py: 1 }}>
                    <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                <PersonIcon color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Patient Information</Typography>
                                    {selectedAppointment?.patientFor && (
                                        <Typography variant="body2" color="text.secondary">
                                            Name: {selectedAppointment.patientFor}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.patientId && (
                                        <Typography variant="body2" color="text.secondary">
                                            Patient ID: {selectedAppointment.patientId}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedAppointment?.age && `Age: ${selectedAppointment.age}`}
                                        {selectedAppointment?.gender && selectedAppointment.age && `, `}
                                        {selectedAppointment?.gender && `Gender: ${selectedAppointment.gender === 'M' ? 'Male' : selectedAppointment.gender === 'F' ? 'Female' : selectedAppointment.gender}`}
                                    </Typography>
                                    {selectedAppointment?.phone && (
                                        <Typography variant="body2" color="text.secondary">
                                            Phone: {selectedAppointment.phone}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.guardian && selectedAppointment.guardian !== "N/A" && (
                                        <Typography variant="body2" color="text.secondary">
                                            Guardian: {selectedAppointment.guardian}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.allergies && (
                                        <Typography variant="body2" color="text.secondary">
                                            Allergies: {selectedAppointment.allergies}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarTodayIcon color="primary" sx={{ mr: 1.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Appointment Slot</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedAppointment && formatDate(selectedAppointment.date)}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <QueueIcon color="primary" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle2">Your Token</Typography>
                                    <Typography variant="body2" color="text.secondary">#{selectedAppointment?.token}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle2">Expected Time</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedAppointment?.estimatedWaitTime}</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <MedicalServicesIcon color="primary" sx={{ mr: 1.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Appointment Details</Typography>
                                    {selectedAppointment?.appointmentType && (
                                        <Typography variant="body2" color="text.secondary">
                                            Type: {selectedAppointment.appointmentType}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.disease && selectedAppointment.disease !== "Not specified" && (
                                        <Typography variant="body2" color="text.secondary">
                                            Issue: {selectedAppointment.disease}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.status && (
                                        <Typography variant="body2" color="text.secondary">
                                            Status: {selectedAppointment.status}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.checkin !== undefined && (
                                        <Typography variant="body2" color="text.secondary">
                                            Check-in Status: {selectedAppointment.checkin ? "Checked In" : "Not Checked In"}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ReceiptIcon color="primary" sx={{ mr: 1.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Payment Information</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Payment Status: {selectedAppointment?.paid === true ? "Paid" : "Not Paid"}
                                        </Typography>
                                    {selectedAppointment?.mode && (
                                        <Typography variant="body2" color="text.secondary">
                                            Payment Mode: {selectedAppointment.mode}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 0.5 }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <PhoneIcon color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2">Doctor Information</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Dr. {selectedAppointment?.doctor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clinic: {selectedAppointment?.clinic}
                                        </Typography>
                                        {selectedAppointment?.fees !== undefined && (
                                            <Typography variant="body2" color="text.secondary">
                                                Consultation Fee: ₹{selectedAppointment.fees}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => {
                        setShowAppointmentDetails(false);
                        navigate(`/doctor/${selectedAppointment?.cabinId}`);
                    }} variant="contained" size="small" fullWidth sx={{ borderRadius: 2 }}>
                        View Doctor
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatientHome;
