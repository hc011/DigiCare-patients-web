import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import QueueIcon from "@mui/icons-material/Queue";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Skeleton,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { getAllAppointments, getAppointmentDetails } from "../services/api";

const AppointmentsList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async() => {
            try {
                setLoading(true);
                const response = await getAllAppointments();
                const sortedAppointments = response.sort((a, b) => new Date(b.slot) - new Date(a.slot));
                setAppointments(sortedAppointments);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const getStatusChip = (status) => {
        switch (status) {
            case "pending":
                return (
                    <Chip 
                        icon={<AccessTimeIcon />}
                        label="Pending"
                        color="primary"
                        variant="outlined" 
                    />
                );
            case "done_checkup":
                return (
                    <Chip 
                        icon={<CheckCircleIcon />}
                        label="Completed"
                        color="success"
                        variant="outlined" 
                    />
                );
            case "cancelled":
                return (
                    <Chip 
                        icon={<CancelIcon />}
                        label="Cancelled"
                        color="error"
                        variant="outlined" 
                    />
                );
            default:
                return (
                    <Chip 
                        icon={<AccessTimeIcon />}
                        label="Pending"
                        color="primary"
                        variant="outlined" 
                    />
                );
        }
    };

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

    const fetchAppointmentdetails = async (appointment_id) => {
        try {
            const response = await getAppointmentDetails(appointment_id);
            return response;
        } catch (error) {
            console.error("Error fetching current appointments:", error);
        } finally {
        }
    }

    const handleViewDetails = async (appointment_id) => {
        const appointmentDetails = await fetchAppointmentdetails(appointment_id);
        setSelectedAppointment(appointmentDetails);
        setOpenDialog(true);
    };

    const handleDirections = () => {
        const coordinates = selectedAppointment?.cabin?.hospital?.map_location?.split(",");
        const lat = coordinates[0].trim();
        const long = coordinates[1].trim();
        const address =  `${lat},${long}`
        
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
    }
    
    // Group appointments by date categories
    const getGroupedAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const groups = {
            today: [],
            tomorrow: [],
            upcoming: [],
            past: []
        };
        
        appointments.forEach(appointment => {
            if (!appointment.slot) {
                return;
            }
            
            const appointmentDate = new Date(appointment.slot);
            appointmentDate.setHours(0, 0, 0, 0);
            
            if (appointmentDate < today) {
                groups.past.push(appointment);
            } else if (appointmentDate.getTime() === today.getTime()) {
                groups.today.push(appointment);
            } else if (appointmentDate.getTime() === tomorrow.getTime()) {
                groups.tomorrow.push(appointment);
            } else {
                groups.upcoming.push(appointment);
            }
        });
        
        // Sort appointments within each group
        const sortByTime = (a, b) => new Date(a.slot) - new Date(b.slot);
        
        groups.today.sort(sortByTime);
        groups.tomorrow.sort(sortByTime);
        groups.upcoming.sort(sortByTime);
        groups.past.sort((a, b) => new Date(b.slot) - new Date(a.slot)); // Past appointments in reverse chronological order
        
        return groups;
    };
    
    // Get relative time description
    const getRelativeTimeDescription = (dateStr) => {
        if (!dateStr) return "";
        
        const appointmentDate = new Date(dateStr);
        const now = new Date();
        
        // Same day check
        if (appointmentDate.toDateString() === now.toDateString()) {
            const diffHours = Math.round((appointmentDate - now) / (1000 * 60 * 60));
            
            if (diffHours <= 0) {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return days[appointmentDate.getDay()];
            } else if (diffHours === 1) {
                return "In 1 hour";
            } else if (diffHours < 24) {
                return `In ${diffHours} hours`;
            }
        }
        
        // Tomorrow check
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        if (appointmentDate.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        }
        
        // Within a week
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        if (appointmentDate < nextWeek) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[appointmentDate.getDay()];
        }
        
        // Past appointment
        if (appointmentDate < now) {
            const diffDays = Math.round((now - appointmentDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                return "Yesterday";
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return formatDate(dateStr).split(',')[0]; // Just the date part
            }
        }
        
        // More than a week in the future
        return formatDate(dateStr).split(',')[0]; // Just the date part
    };

    return (
        <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 130px)", overflowY: "auto" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mb: -2 }}>
                    <BackButton />
                </Box>
                <Typography variant="h6" fontWeight="600" sx={{ ml: 1 }}>
                    My Appointments
                </Typography>
            </Box>

            {loading ? (
                <List>
                    {[1, 2, 3].map((item) => (
                        <Paper 
                            key={item}
                            elevation={0}
                            sx={{
                                mb: 2,
                                bgcolor: "#f5f5f5",
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <ListItem>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Skeleton 
                                            variant="text"
                                            width="40%"
                                            height={24}
                                        />
                                        <Skeleton 
                                            variant="rectangular"
                                            width={100}
                                            height={32}
                                            sx={{ borderRadius: 1 }}
                                        />
                                    </Box>
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="70%" />
                                </Box>
                            </ListItem>
                            <Divider />
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="text" width="70%" />
                                        <Skeleton variant="text" width="50%" />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                                <Skeleton 
                                    variant="rectangular"
                                    width={100}
                                    height={36}
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>
                        </Paper>
                    ))}
                </List>
            ) : appointments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CalendarTodayIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Appointments Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        You don't have any appointments scheduled yet.
                    </Typography>
                    <Button 
                        variant="contained"
                        onClick={() => navigate("/search")}
                        sx={{ borderRadius: 2 }}
                    >
                        Book Appointment
                    </Button>
                </Box>
            ) : (
                <Box>
                    {/* Grouped appointments */}
                    {(() => {
                        const groups = getGroupedAppointments();
                        const sections = [
                            { key: 'today', title: 'Today', appointments: groups.today, color: 'primary.main' },
                            { key: 'tomorrow', title: 'Tomorrow', appointments: groups.tomorrow, color: 'info.main' },
                            { key: 'upcoming', title: 'Upcoming', appointments: groups.upcoming, color: 'success.main' },
                            { key: 'past', title: 'Past Appointments', appointments: groups.past, color: 'text.secondary' },
                        ];
                        
                        return sections.map(section => 
                            section.appointments.length > 0 && (
                                <Box key={section.key} sx={{ mb: 3 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        mt: 3
                                    }}>
                                        <Box sx={{ 
                                            width: 4, 
                                            height: 20, 
                                            bgcolor: section.color,
                                            borderRadius: 1,
                                            mr: 1.5
                                        }} />
                                        <Typography 
                                            variant="subtitle1" 
                                            fontWeight={600}
                                            color={section.key === 'past' ? 'text.secondary' : 'text.primary'}
                                        >
                                            {section.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                        >
                                            ({section.appointments.length})
                                        </Typography>
                                    </Box>
                                    
                                    <List disablePadding>
                                        {section.appointments.map((appointment, ind) => (
                                            <Paper 
                                                key={ind}
                                                elevation={0}
                                                sx={{
                                                    mb: 2,
                                                    bgcolor: "#f5f5f5",
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    transition: 'box-shadow 0.3s',
                                                    border: section.key === 'today' ? `1px solid rgba(25, 118, 210, 0.2)` : '1px solid rgba(0,0,0,0.05)',
                                                    '&:hover': {
                                                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                            >
                                                <ListItem>
                                                    <ListItemText 
                                                        primary={
                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                                                <Typography variant="subtitle1" fontWeight="600">
                                                                    Dr. {appointment?.doctor}
                                                                </Typography>
                                                                {/* <Chip 
                                                                    label={getRelativeTimeDescription(appointment?.slot)}
                                                                    size="small"
                                                                    color={section.key === 'today' ? 'primary' : 'default'}
                                                                    variant={section.key === 'today' ? 'filled' : 'outlined'}
                                                                    sx={{ 
                                                                        fontWeight: 500,
                                                                        borderRadius: '12px',
                                                                        height: '24px'
                                                                    }}
                                                                /> */}
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography variant="body2">
                                                                    {formatDate(appointment?.slot)}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {appointment?.hospital} 
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider />
                                                <Box sx={{ p: 2 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                                <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                                                                <Typography variant="body2">
                                                                    <strong>Patient:</strong> {appointment?.patient_name}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                                                                <QueueIcon sx={{ mr: 1, color: "primary.main" }} />
                                                                <Typography variant="body2">
                                                                    <strong>Token:</strong> #{appointment?.token}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                                                    <Button 
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => handleViewDetails(appointment.appointment_id)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            '&:hover': {
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                                            }
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </List>
                                </Box>
                            )
                        );
                    })()}
                </Box>
            )}

            {/* Appointment Details Dialog */}
            <Dialog 
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullScreen
                PaperProps={{
                    sx: {
                        overflowY: "auto",
                        bgcolor: "#f9fafc"
                    }
                }}
            >
                {selectedAppointment && (
                    <>
                        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3, position: 'relative', boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                            <IconButton 
                                aria-label="back"
                                onClick={() => setOpenDialog(false)}
                                sx={{
                                    position: 'absolute',
                                    left: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'white'
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600 }}>
                                Appointment Details
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, mb: 8 }}>
                            <Grid container spacing={3}>
                                {/* Patient Information Card */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ 
                                        p: 2, 
                                        borderRadius: 3,
                                        height: '100%',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonIcon sx={{ 
                                                color: 'white', 
                                                bgcolor: 'primary.main', 
                                                p: 0.5, 
                                                borderRadius: '50%',
                                                mr: 1
                                            }} />
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Patient Information
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <Box sx={{ pl: 1 }}>
                                            {selectedAppointment.name && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Name:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment.name}
                                                </Typography>
                                                </Box>
                                            )}
                                            
                                            {selectedAppointment?.patient && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Patient ID:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.patient?.patient_id}
                                                </Typography>
                                                </Box>
                                            )}
                                            
                                            {(selectedAppointment?.patient?.age || selectedAppointment?.patient?.gender) && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Details:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.patient?.age && `Age: ${selectedAppointment?.patient?.age}`} 
                                                        {selectedAppointment?.patient?.gender && selectedAppointment?.patient.age && `, `} 
                                                        {selectedAppointment?.patient?.gender && `Gender: ${selectedAppointment?.patient?.gender === 'M' ? 'Male' : selectedAppointment?.patient?.gender === 'F' ? 'Female' : selectedAppointment?.patient?.gender}`}
                                            </Typography>
                                                </Box>
                                            )}
                                            
                                            {selectedAppointment?.patient?.phone_number && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Phone:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.patient?.phone_number}
                                                </Typography>
                                                </Box>
                                            )}
                                            
                                            {selectedAppointment?.patient?.guardian && selectedAppointment?.patient?.guardian !== "N/A" && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Guardian:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.patient?.guardian}
                                                </Typography>
                                                </Box>
                                            )}
                                            
                                            {selectedAppointment?.patient?.allergies && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Allergies:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.patient?.allergies}
                                                </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Appointment Details Card */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ 
                                        p: 2, 
                                        borderRadius: 3,
                                        height: '100%',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <CalendarTodayIcon sx={{ 
                                                color: 'white', 
                                                bgcolor: 'primary.main', 
                                                p: 0.5, 
                                                borderRadius: '50%',
                                                mr: 1
                                            }} />
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Appointment Details
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <Box sx={{ pl: 1 }}>
                                            <Box sx={{ display: 'flex', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                    Date:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatDate(selectedAppointment?.cabinslot?.slot)}
                                                </Typography>
                                    </Box>
                                            
                                            <Box sx={{ display: 'flex', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                    Token:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                #{selectedAppointment?.token}
                                            </Typography>
                                        </Box>
                                            
                                            {selectedAppointment?.appointment_type && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Type:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.appointment_type}
                                            </Typography>
                                        </Box>
                                            )}
                                            
                                            {selectedAppointment?.disease && selectedAppointment?.disease !== "Not specified" && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Issue:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {selectedAppointment?.disease}
                        </Typography>
                                                </Box>
                                            )}
                                            
                                            {selectedAppointment?.queobj?.status && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Status:
                        </Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {getStatusChip(selectedAppointment?.queobj?.status)}
                        </Typography>
                                                </Box>
                      )}
                                            
                      {selectedAppointment?.queobj?.checkin !== undefined && (
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                        Check-in:
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500} sx={{ 
                                                            color: selectedAppointment.queobj.checkin ? 'success.main' : 'error.main'
                            }}>
                                {selectedAppointment.queobj.checkin ? "Checked In" : "Not Checked In"}
                          </Typography>
                          {!selectedAppointment.queobj.checkin && (
                                                            <Typography variant="caption" sx={{ 
                                                                color: 'error.main',
                                                                display: 'block'
                                                            }}>
                                                                Please visit reception desk for check-in
                        </Typography>
                      )}
                    </Box>
                  </Box>
                                            )}
                                            
                                            <Box sx={{ display: 'flex', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                    Payment:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500} sx={{ 
                                                    color: selectedAppointment?.queobj?.paid ? 'success.main' : 'error.main'
                                                }}>
                                                    {selectedAppointment?.queobj?.paid ? "Paid" : "Not Paid"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Doctor Information Card */}
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ 
                                        p: 2, 
                                        borderRadius: 3,
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <MedicalServicesIcon sx={{ 
                                                color: 'white', 
                                                bgcolor: 'primary.main', 
                                                p: 0.5, 
                                                borderRadius: '50%',
                                                mr: 1
                                            }} />
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Doctor Information
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8}>
                                                <Box sx={{ pl: 1 }}>
                                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                            Doctor:
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            Dr. {selectedAppointment?.cabin?.doctor?.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                                            Clinic:
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {selectedAppointment?.cabin?.hospital?.hospital_name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<PhoneIcon />}
                                            sx={{ borderRadius: 2, flex: 1 }}
                                            onClick={() => window.open(`tel:${selectedAppointment?.cabin?.hospital?.phone_number}`)}
                                        >
                                            Call
                                        </Button>
                                        <Button 
                                                        variant="contained"
                                            startIcon={<DirectionsIcon />}
                                            sx={{ borderRadius: 2, flex: 1 }}
                                            onClick={handleDirections}
                                        >
                                            Directions
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                        
                        {/* Fixed bottom close button */}
                        <Box 
                            sx={{ 
                                position: 'fixed', 
                                bottom: 0, 
                                left: 0, 
                                right: 0, 
                                p: 2, 
                                bgcolor: 'white', 
                                borderTop: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                                zIndex: 1
                            }}
                        >
                            <Button 
                                variant="contained"
                                fullWidth 
                                onClick={() => setOpenDialog(false)}
                                sx={{ borderRadius: 2, py: 1.2 }}
                            >
                                Close
                            </Button>
                        </Box>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AppointmentsList;