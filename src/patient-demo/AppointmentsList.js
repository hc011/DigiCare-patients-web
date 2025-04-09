import AccessTimeIcon from "@mui/icons-material/AccessTime";
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

    return (
        <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 130px)", overflowY: "auto" }}>
            <BackButton />
            <Typography variant="h6" gutterBottom fontWeight="600">
                My Appointments
            </Typography>

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
                <List>
                    {appointments.map((appointment, ind) => (
                        <Paper 
                            key={ind}
                            elevation={0}
                            sx={{
                                mb: 2,
                                bgcolor: "#f5f5f5",
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <ListItem>
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="subtitle1" fontWeight="600">
                                                Dr. {appointment?.doctor}
                                            </Typography>
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
                                {/* {appointment.queobj.status === 'pending' && (
                                    <Button 
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{
                                            mr: 1,
                                            borderRadius: 2,
                                            '&:hover': {
                                                bgcolor: 'rgba(211, 47, 47, 0.04)'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )} */}
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
            )}

            {/* Appointment Details Dialog */}
            <Dialog 
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth 
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                {selectedAppointment && (
                    <>
                        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 1.5, px: 3, position: 'relative' }}>
                            <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
                                Appointment Details
                            </DialogTitle>
                            <IconButton 
                                aria-label="close"
                                onClick={() => setOpenDialog(false)}
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
                                            {selectedAppointment.name && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Name: {selectedAppointment.name}
                                                </Typography>
                                            )}
                                            {selectedAppointment?.patient && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Patient ID: {selectedAppointment?.patient?.patient_id}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedAppointment?.patient?.age && `Age: ${selectedAppointment?.patient?.age}`} {selectedAppointment?.patient?.gender && selectedAppointment?.patient.age && `, `} {selectedAppointment?.gender && `Gender: ${selectedAppointment?.patient?.gender === 'M' ? 'Male' : selectedAppointment?.patient?.gender === 'F' ? 'Female' : selectedAppointment?.patient?.gender}`}
                                            </Typography>
                                            {selectedAppointment?.patient?.phone_number && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Phone: {selectedAppointment?.patient?.phone_number}
                                                </Typography>
                                            )}
                                            {selectedAppointment?.patient?.guardian && selectedAppointment?.patient?.guardian !== "N/A" && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Guardian: {selectedAppointment?.patient?.guardian}
                                                </Typography>
                                            )}
                                            {selectedAppointment?.patient?.allergies && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Allergies: {selectedAppointment?.patient?.allergies}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarTodayIcon color="primary" sx={{ mr: 1.5 }} />
                                        <Box>
                                            <Typography variant="subtitle2">Appointment Date</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(selectedAppointment?.cabinslot?.slot)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <QueueIcon color="primary" sx={{ mr: 1 }} />
                                        <Box>
                                            <Typography variant="subtitle2">Your Token</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                #{selectedAppointment?.token}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                        <Box>
                                            <Typography variant="subtitle2">Status</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedAppointment?.queobj?.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MedicalServicesIcon color="primary" sx={{ mr: 1.5 }} />
                    <Box>
                      <Typography variant="subtitle2">Appointment Details</Typography>
                      {selectedAppointment?.appointment_type && (
                        <Typography variant="body2" color="text.secondary">
                          Type: {selectedAppointment?.appointment_type}
                        </Typography>
                      )}
                      {selectedAppointment?.disease && selectedAppointment?.disease !== "Not specified" && (
                        <Typography variant="body2" color="text.secondary">
                          Issue: {selectedAppointment?.disease}
                        </Typography>
                      )}
                      {selectedAppointment.queobj && selectedAppointment.queobj.status && (
                        <Typography variant="body2" color="text.secondary">
                          Status: {selectedAppointment?.queobj?.status}
                        </Typography>
                      )}
                      {selectedAppointment?.queobj && selectedAppointment?.queobj.checkin !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          Check-in Status: {selectedAppointment?.queobj?.checkin ? "Checked In" : "Not Checked In"}
                        </Typography>
                      )}
                      {selectedAppointment?.queobj?.waiting && (
                        <Typography variant="body2" color="text.secondary">
                          Waiting: {selectedAppointment?.queobj?.waiting}
                        </Typography>
                      )}
                      {selectedAppointment?.queobj?.wait_time && (
                        <Typography variant="body2" color="text.secondary">
                          Expected Time: {selectedAppointment?.queobj?.wait_time}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MedicalServicesIcon color="primary" sx={{ mr: 1.5 }} />
                    <Box>
                      <Typography variant="subtitle2">Payment Information</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status: {selectedAppointment?.queobj?.paid ? "Paid" : "Not Paid"}
                        </Typography>
                      {selectedAppointment?.mode && (
                        <Typography variant="body2" color="text.secondary">
                          Payment Mode: {selectedAppointment?.mode}
                        </Typography>
                      )}
                      {selectedAppointment?.fees_paid && (
                        <Typography variant="body2" color="text.secondary">
                          Payment Mode: {selectedAppointment?.fees_paid}
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

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<PhoneIcon />}
                                            sx={{ borderRadius: 2, flex: 1 }}
                                            onClick={() => window.open(`tel:${selectedAppointment?.cabin?.hospital?.phone_number}`)}
                                        >
                                            Call
                                        </Button>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<DirectionsIcon />}
                                            sx={{ borderRadius: 2, flex: 1 }}
                                            onClick={handleDirections}
                                        >
                                            Directions
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        {/* <DialogActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                                onClick={() => {
                                    setOpenDialog(false);
                                    navigate(`/doctor/${selectedAppointment.cabinslot.cabin.id}`);
                                }}
                                variant="contained"
                                size="small"
                                fullWidth 
                                sx={{ borderRadius: 2 }}
                            >
                                View Doctor
                            </Button>
                        </DialogActions> */}
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AppointmentsList;