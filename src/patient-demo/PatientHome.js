import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Avatar,
  LinearProgress,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ButtonGroup
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import QueueIcon from "@mui/icons-material/Queue";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";

const PatientHome = ({ appointments = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const currentAppointment = appointments.find(
    (app) => app.status === "upcoming"
  ) || {
    id: 1,
    doctor: "Dr. Rahul Gupta",
    date: "2024-03-20",
    status: "upcoming",
    clinic: "Gupta Skin and dental clinic",
    specialty: "Skin Specialist",
    token: 15,
    currentToken: 8,
    estimatedWaitTime: "1hr 27 mins",
    patientId: "P12345",
    location: "Station Road, Alwar",
    appointmentType: "New",
    disease: "Skin Allergy",
    patientFor: "Self",
    phone: "+91 12345 67890",
    age: "32",
    gender: "M"
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
    } else if (currentAppointment) {
      setHasAppointment(true);
    }
  }, [location, currentAppointment]);

  // Calculate queue progress
  const getCurrentProgress = () => {
    if (!currentAppointment) return 0;
    const currentToken = currentAppointment.currentToken || 8;
    const yourToken = currentAppointment.token || 15;
    return Math.min(100, (currentToken / yourToken) * 100);
  };

  // Calculate people ahead of you
  const getPeopleAhead = () => {
    if (!currentAppointment) return 0;
    const currentToken = currentAppointment.currentToken || 8;
    const yourToken = currentAppointment.token || 15;
    return Math.max(0, yourToken - currentToken);
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

  const handleViewDetails = () => {
    setShowAppointmentDetails(true);
  };

  const handleCall = () => {
    window.open(`tel:${currentAppointment.phone}`);
  };

  const handleDirections = () => {
    window.open(`https://maps.google.com/?q=${currentAppointment.location}`);
  };

  return (
    <Box sx={{ p: 2, pb: 16, height: "calc(100vh - 180px)", overflowY: "auto" }}>
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
      
      {/* Success Message */}
      {showBookingSuccess && !loading && (
        <Box 
          sx={{ 
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
          }}
        >
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <Typography variant="body1" fontWeight="medium">Appointment booked successfully!</Typography>
        </Box>
      )}

      {/* Header with greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Welcome back, Himanshu
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Card
            sx={{
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
            onClick={() => navigate("/search")}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#4f46e5', mx: 'auto', mb: 1 }}>
                <SearchIcon />
              </Avatar>
              <Typography variant="body1" fontWeight="medium">
                Find Doctors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
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
            onClick={() => navigate("/appointments")}
          >
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
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Current Appointment
      </Typography>

      {hasAppointment && currentAppointment ? (
        <Card 
          elevation={1} 
          sx={{ 
            borderRadius: 3, 
            mb: 4, 
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
          }}
        >
          <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2 }}>
            <Typography variant="subtitle1">
              {currentAppointment.clinic}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {currentAppointment.doctor} • {currentAppointment.specialty}
            </Typography>
          </Box>
          
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <QueueIcon color="primary" />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your Token
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    #{currentAppointment.token || 15}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    People Ahead of You
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {getPeopleAhead()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Queue Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={getCurrentProgress()} 
              sx={{ height: 8, borderRadius: 4, mb: 1 }}
            />
            
            <Box sx={{
              mt: 3,
              p: 2,
              bgcolor: '#f0f9ff',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Estimated Wait Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentAppointment.estimatedWaitTime || "1hr 27 mins"}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label="In Progress" 
                color="primary" 
                size="small"
                sx={{ 
                  '& .MuiChip-label': { 
                    px: 1,
                    fontSize: '0.75rem'
                  } 
                }}
              />
            </Box>
            
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                mt: 3, 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateX(4px)'
                }
              }}
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card 
          elevation={1} 
          sx={{ 
            borderRadius: 3, 
            mb: 4, 
            p: 3, 
            bgcolor: '#fafafa',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
          }}
        >
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <EventBusyIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Appointment Scheduled Currently
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You don't have any active appointments in the queue.
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

      {/* Popular Specialties */}
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Popular Specialties
      </Typography>
      <Grid container spacing={2} sx={{ mb: 8 }}>
        {["Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician"].map((specialty, index) => (
          <Grid item xs={6} key={index}>
            <Card 
              sx={{ 
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
              onClick={() => navigate("/search")}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body1">{specialty}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        fullWidth
        startIcon={<SearchIcon />}
        onClick={() => navigate("/search")}
        sx={{ 
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
          '&:hover': { 
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -2px)'
          },
          '&:active': {
            transform: 'translate(-50%, 0)',
          }
        }}
      >
        Book New Appointment
      </Button>

      {/* Appointment Details Dialog */}
      <Dialog 
        open={showAppointmentDetails} 
        onClose={() => setShowAppointmentDetails(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
          <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
            Appointment Details
          </DialogTitle>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {currentAppointment.doctor} • {currentAppointment.specialty}
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
                    {formatDate(currentAppointment.date)}
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
                    #{currentAppointment.token}
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
                    {getPeopleAhead()}
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
                    {currentAppointment.clinic}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentAppointment.location}
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
                      {currentAppointment.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      startIcon={<PhoneIcon />}
                      onClick={handleCall}
                      sx={{ height: '32px', fontSize: '0.8rem' }}
                    >
                      Call
                    </Button>
                    <Button
                      startIcon={<DirectionsIcon />}
                      onClick={handleDirections}
                      sx={{ height: '32px', fontSize: '0.8rem' }}
                    >
                      Map
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Wait Time</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentAppointment.estimatedWaitTime}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCurrentProgress()} 
                    sx={{ height: 6, borderRadius: 3, mt: 1, width: '100%', maxWidth: 200 }}
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicalServicesIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Appointment Details</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {currentAppointment.appointmentType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issue: {currentAppointment.disease}
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
                    Patient ID: {currentAppointment.patientId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    For: {currentAppointment.patientFor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age: {currentAppointment.age}, Gender: {currentAppointment.gender === 'M' ? 'Male' : currentAppointment.gender === 'F' ? 'Female' : 'Other'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setShowAppointmentDetails(false)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              setShowAppointmentDetails(false);
              navigate(`/doctor/${currentAppointment.id}`);
            }}
            variant="contained"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            View Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientHome;
