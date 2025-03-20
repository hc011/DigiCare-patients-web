import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Divider,
  Button,
  Grid,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QueueIcon from "@mui/icons-material/Queue";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";

const AppointmentsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data - replace with API call
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Rahul Gupta",
      date: "2024-03-20",
      status: "upcoming",
      clinic: "Gupta Skin and dental clinic",
      specialty: "Skin Specialist",
      token: 15,
      currentToken: 8,
      estimatedWaitTime: "35 minutes",
      patientId: "P12345",
      location: "Station Road, Alwar",
      appointmentType: "New",
      disease: "Skin Allergy",
      patientFor: "Self",
      phone: "+91 12345 67890"
    },
    {
      id: 2,
      doctor: "Dr. Priya Singh",
      date: "2024-01-15",
      status: "completed",
      clinic: "Sardar Hospital",
      specialty: "Pediatrics",
      token: 22,
      currentToken: 22,
      estimatedWaitTime: "0 minutes",
      patientId: "P12344",
      location: "Bhiwadi Road, Alwar",
      appointmentType: "Follow-up",
      disease: "Fever",
      patientFor: "Child (Rohan)",
      phone: "+91 98765 43210"
    },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <Chip
            icon={<AccessTimeIcon />}
            label="Upcoming"
            color="primary"
            variant="outlined"
          />
        );
      case "completed":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            color="success"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            icon={<CancelIcon />}
            label="Canceled"
            color="error"
            variant="outlined"
          />
        );
    }
  };

  const getQueueProgress = (currentToken, token, status) => {
    if (status === "completed") return 100;
    const progress = (currentToken / token) * 100;
    return Math.min(progress, 100);
  };
  
  // Get people ahead of you
  const getPeopleAhead = (currentToken, token, status) => {
    if (status === "completed") return 0;
    return Math.max(0, token - currentToken);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewDetails = (appointment) => {
    // Clear previous appointment
    setSelectedAppointment(null);
    
    // Set loading state
    setLoading(true);
    
    // Set the appointment and open dialog after a delay
    setTimeout(() => {
      setSelectedAppointment(appointment);
      setLoading(false);
      setOpenDialog(true);
    }, 500);
  };

  const handleNavigateToDoctor = () => {
    if (selectedAppointment) {
      setOpenDialog(false);
      // Extract doctor ID from the appointment
      // In this mock data we don't have doctorId, so let's assume it's the appointment.id
      const doctorId = selectedAppointment.id;
      navigate(`/doctor/${doctorId}`);
    }
  };

  return (
    <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 130px)", overflowY: "auto" }}>
      {/* Loading Overlay */}
      {loading && (
        <Box 
          sx={{ 
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
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CalendarTodayIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Appointments Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You don't have any appointments yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/search")}
            sx={{ borderRadius: 2 }}
          >
            Find a Doctor
          </Button>
        </Box>
      ) : (
        <List>
          {appointments.map((appointment) => (
            <Paper
              key={appointment.id}
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
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">
                        {appointment.doctor}
                      </Typography>
                      {getStatusChip(appointment.status)}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">
                        {formatDate(appointment.date)}
                      </Typography>
                      <Typography variant="body2">
                        {appointment.clinic} - {appointment.specialty}
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
                        <strong>Patient:</strong> {appointment.patientFor}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <QueueIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        <strong>Token:</strong> #{appointment.token}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        <strong>Wait Time:</strong> {appointment.estimatedWaitTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body2">
                        <strong>Location:</strong> {appointment.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Appointment Type:</strong> {appointment.appointmentType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Issue:</strong> {appointment.disease}
                    </Typography>
                  </Grid>
                </Grid>

                {appointment.status === "upcoming" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Queue Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getQueueProgress(appointment.currentToken, appointment.token, appointment.status)}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      People ahead of you: {getPeopleAhead(appointment.currentToken, appointment.token, appointment.status)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {appointment.status === "upcoming" && (
                <>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ 
                        mr: 1,
                        '&:hover': {
                          bgcolor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewDetails(appointment)}
                      sx={{
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          ))}
        </List>
      )}

      {/* Appointment Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedAppointment && (
          <>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
              <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
                Appointment Details
              </DialogTitle>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedAppointment.doctor} • {selectedAppointment.specialty}
              </Typography>
            </Box>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">Date</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedAppointment.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QueueIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">Your Token</Typography>
                      <Typography variant="body2" color="text.secondary">
                        #{selectedAppointment.token}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">People Ahead</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getPeopleAhead(selectedAppointment.currentToken, selectedAppointment.token, selectedAppointment.status)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">Clinic</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAppointment.clinic}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAppointment.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon color="primary" sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2">Contact</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedAppointment.phone}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<PhoneIcon />}
                        sx={{ mr: 1, borderRadius: 2 }}
                        onClick={() => window.open(`tel:${selectedAppointment.phone}`)}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<DirectionsIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() => window.open(`https://maps.google.com/?q=${selectedAppointment.location}`)}
                      >
                        Directions
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalServicesIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">Appointment Details</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {selectedAppointment.appointmentType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Issue: {selectedAppointment.disease}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle2">Patient Information</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patient ID: {selectedAppointment.patientId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        For: {selectedAppointment.patientFor}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
              <Button 
                onClick={handleNavigateToDoctor}
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                View Doctor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AppointmentsList;
