import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import QueueIcon from "@mui/icons-material/Queue";
import ReceiptIcon from '@mui/icons-material/Receipt';
import RefreshIcon from '@mui/icons-material/Refresh';
import { formatSecondsToHoursMinutes } from "../utils/timeUtils";
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
    Skeleton,
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
import { getAllAppointments, getAppointmentDetails } from "../services/api";

const AppointmentSkeleton = () => (
    <Card elevation={1} sx={{
        borderRadius: 3,
        overflow: 'hidden',
    }}>
        <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        </Box>
        <CardContent>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width="70%" height={24} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width="60%" height={24} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width="40%" height={24} />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto' }} />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto' }} />
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
                    <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 2, mr: 1 }} />
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2, mt: 2 }} />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

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

    const fetchCurrentAppointments = async () => {
        try {
            setLoading(true);
            const response = await getAllAppointments("upcoming");
            const sortedAppointments = response.sort((a, b) => (a.waiting) - (b.waiting));
            setCurrentAppointments(sortedAppointments);
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
    }

    const handleWaitingReload = async () => {
        try {
            setIsWaitingRefreshing(true);
            const response = await getAllAppointments("upcoming");
            
            // Update only waiting and wait_time for existing appointments
            setCurrentAppointments(prevAppointments => {
                return prevAppointments.map(prevApp => {
                    const updatedApp = response.find(newApp => newApp.appointment_id === prevApp.appointment_id);
                    if (updatedApp) {
                        return {
                            ...prevApp,
                            waiting: updatedApp.waiting,
                            wait_time: updatedApp.wait_time
                        };
                    }
                    return prevApp;
                });
            });
        } catch (error) {
            console.error("Error refreshing waiting times:", error);
        } finally {
            setIsWaitingRefreshing(false);
        }
    };
    
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
    const appointmentsList = currentAppointments;

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    useEffect(() => {
        // Check if we should show appointment based on URL param or existing appointments
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('appointmentBooked') === 'true' || location.state?.bookingSuccess) {
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

    // Add interval to update wait times every minute
    // useEffect(() => {
    //     // Initial fetch already happens in the first useEffect
        
    //     // Set up interval to fetch fresh data every minute (60000 ms)
    //     const interval = setInterval(() => {
    //         fetchCurrentAppointments();
    //     }, 6000);

    //     // Clean up interval on component unmount
    //     return () => clearInterval(interval);
    // }, []); 

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

    const handleViewDetails = async (appointment_id) => {
        await fetchAppointmentdetails(appointment_id);
        setShowAppointmentDetails(true);
    };

    const handleCall = () => {
        window.open(`tel:${selectedAppointment?.doctorPhone}`);
    };

    const handleDirections = (location) => {
        const coordinates = location.split(",");
        const latitude = coordinates[0];
        const longitude = coordinates[1]; 
        const address =  `${latitude},${longitude}`
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
    };

    return (
        <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 180px)", overflowY: "auto" }}>


            {/* Success Message */}
            {showBookingSuccess && (
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
                    }}
                        onClick={() => navigate("/doctor/2")}>
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
                    }}
                        onClick={() => navigate("/appointments")}>
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
                {loading ? (
                    <AppointmentSkeleton />
                ) : appointmentsList.length > 0 ? (
                    <Box sx={{ position: 'relative' }}>
                        <Swiper modules={[Navigation, Pagination]} spaceBetween={30} slidesPerView={1} navigation={false} pagination={{
                            clickable: true
                        }} onSlideChange={(swiper) => handleStepChange(swiper.activeIndex)} style={{
                            borderRadius: 12,
                            overflow: 'visible',
                            '--swiper-pagination-color': '#1976d2'
                        }}>
                            {appointmentsList.map((appointment, index) => (
                                <SwiperSlide key={appointment.appointment_id}>
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
                                                <Typography variant="subtitle1" fontWeight="600">Dr. {appointment?.doctor}</Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    {appointment?.hospital}
                                                </Typography>
                                            </Box>

                                            <CardContent>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                                                            <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>Slot:</strong> {formatDate(appointment?.slot)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>Patient Name:</strong> {appointment?.patient_name}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>PID:</strong> {appointment?.pid}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <QueueIcon sx={{ mr: 1, color: "primary.main" }} />
                                                            <Typography variant="body2">
                                                                <strong>Token:</strong> #{appointment?.token}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Box sx={{ 
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: 3,
                                                            p: 2,
                                                            position: 'relative',
                                                            bgcolor: '#f8fafc'
                                                        }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6}>
                                                                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                                                                        <AccessTimeIcon color="primary" />
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            Waiting
                                                                        </Typography>
                                                                        {isWaitingRefreshing ? (
                                                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
                                                                                <CircularProgress size={24} />
                                                                            </Box>
                                                                        ) : (
                                                                            <Typography variant="h5" color="primary" fontWeight="bold">
                                                                                {appointment?.waiting}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                                                                        <AccessTimeIcon color="primary" />
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            Expected Time
                                                                        </Typography>
                                                                        {isWaitingRefreshing ? (
                                                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
                                                                                <CircularProgress size={24} />
                                                                            </Box>
                                                                        ) : (
                                                                            <Typography variant="h5" color="primary" fontWeight="bold">
                                                                                {formatSecondsToHoursMinutes(appointment?.wait_time)}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={handleWaitingReload}
                                                                disabled={isWaitingRefreshing}
                                                                sx={{ 
                                                                    position: 'absolute',
                                                                    bottom: 8,
                                                                    right: 8,
                                                                    bgcolor: 'white',
                                                                    boxShadow: 1,
                                                                    '&:hover': {
                                                                        bgcolor: '#f1f5f9'
                                                                    }
                                                                }}
                                                            >
                                                                <RefreshIcon 
                                                                    fontSize="small" 
                                                                    sx={{
                                                                        animation: isWaitingRefreshing ? 'spin 1s linear infinite' : 'none',
                                                                        '@keyframes spin': {
                                                                            '0%': {
                                                                                transform: 'rotate(0deg)',
                                                                            },
                                                                            '100%': {
                                                                                transform: 'rotate(360deg)',
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0 }}>
                                                        <Button variant="outlined" size="small" startIcon={<PhoneIcon />} sx={{ borderRadius: 2, mr: 1 }} onClick={() => window.open(`tel:${appointment.phone_number}`)}>
                                                            Call
                                                        </Button>
                                                        <Button variant="outlined" size="small" startIcon={<DirectionsIcon />} sx={{ borderRadius: 2 }} onClick={() => handleDirections(appointment.hospital_location)}>
                                                            Directions
                                                        </Button>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Button variant="contained" fullWidth sx={{
                                                            mt: 2,
                                                            borderRadius: 2,
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                transform: 'translateX(4px)'
                                                            }
                                                        }} onClick={() => handleViewDetails(appointment.appointment_id)}>
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
                                No Appointments Scheduled
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                You don't have any scheduled appointments currently.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate("/doctor/2")}  
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
                            }}>
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
                    <IconButton aria-label="close" onClick={() => setShowAppointmentDetails(false)} sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white'
                    }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ py: 1 }}>
                    <Grid container spacing={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                <PersonIcon color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Patient Information</Typography>
                                    {selectedAppointment?.name && (
                                        <Typography variant="body2" color="text.secondary">
                                            Name: {selectedAppointment?.name}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.patient?.patient_id && (
                                        <Typography variant="body2" color="text.secondary">
                                            Patient ID: {selectedAppointment?.patient?.patient_id}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.token && (
                                        <Typography variant="body2" color="text.secondary">
                                            Token: {selectedAppointment?.token}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedAppointment?.patient?.age && `Age: ${selectedAppointment.patient.age}`} {selectedAppointment?.patient?.gender && selectedAppointment?.patient?.age && `, `} {selectedAppointment?.patient?.gender && `Gender: ${selectedAppointment.patient.gender === 'M' ? 'Male' : selectedAppointment.patient.gender === 'F' ? 'Female' : selectedAppointment.patient.gender}`}
                                    </Typography>
                                    {selectedAppointment?.patient?.phone_numer && (
                                        <Typography variant="body2" color="text.secondary">
                                            Phone: {selectedAppointment?.patient?.phone_numer}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.patient?.guardian && selectedAppointment?.patient?.guardian !== "N/A" && (
                                        <Typography variant="body2" color="text.secondary">
                                            Guardian: {selectedAppointment?.patient?.guardian}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.patient?.allergies && (
                                        <Typography variant="body2" color="text.secondary">
                                            Allergies: {selectedAppointment.patient.allergies}
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
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedAppointment?.cabinslot?.slot && formatDate(selectedAppointment?.cabinslot?.slot)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle2">Expected Time</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatSecondsToHoursMinutes(selectedAppointment?.queobj?.wait_time)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle2">Waiting</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedAppointment?.queobj?.waiting}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                                <MedicalServicesIcon color="primary" sx={{ mr: 1.5 }} />
                                <Box>
                                    <Typography variant="subtitle2">Appointment Details</Typography>
                                    {selectedAppointment?.appointmentType && (
                                        <Typography variant="body2" color="text.secondary">
                                            Type: {selectedAppointment.appointmentType}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.disease && selectedAppointment?.disease !== "Not specified" && (
                                        <Typography variant="body2" color="text.secondary">
                                            Issue: {selectedAppointment.disease}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.queobj?.status && (
                                        <Typography variant="body2" color="text.secondary">
                                            Status: {selectedAppointment?.queobj?.status}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.queobj?.checkin !== undefined && (
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                Check-in Status: <Box component="span" sx={{ 
                                                    color: selectedAppointment.queobj.checkin ? '#15803d' : '#dc2626',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {selectedAppointment.queobj.checkin ? "Checked In" : "Not Checked In"}
                                                </Box>
                                            </Typography>
                                            {!selectedAppointment.queobj.checkin && (
                                                <Typography variant="body2" sx={{ 
                                                    color: '#dc2626',
                                                    fontSize: '0.8rem',
                                                    mt: 0.5,
                                                    fontStyle: 'italic'
                                                }}>
                                                    Please visit reception desk for check-in process
                                                </Typography>
                                            )}
                                        </>
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
                                            Payment Status: <Box component="span" sx={{ 
                                                color: selectedAppointment?.queobj?.paid ? '#15803d' : '#dc2626',
                                                fontWeight: 'bold'
                                            }}>
                                                {selectedAppointment?.queobj?.paid ? "Paid" : "Not Paid"}
                                            </Box>
                                        </Typography>
                                    {selectedAppointment?.mode && (
                                        <Typography variant="body2" color="text.secondary">
                                            Payment Mode: {selectedAppointment.mode}
                                        </Typography>
                                    )}
                                    {selectedAppointment?.fees_paid && (
                                        <Typography variant="body2" color="text.secondary">
                                            Fees Paid: {selectedAppointment.fees_paid}
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
                                            Dr. {selectedAppointment?.cabin?.doctor?.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clinic: {selectedAppointment?.cabin?.hospital?.hospital_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => {
                        setShowAppointmentDetails(false);
                        navigate("/doctor/2");
                    }} variant="contained" size="small" fullWidth sx={{ borderRadius: 2 }}>
                        View Doctor
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatientHome;