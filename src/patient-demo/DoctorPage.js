import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  CircularProgress,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  ButtonGroup
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MessageIcon from "@mui/icons-material/Message";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import QueueIcon from "@mui/icons-material/Queue";
import DirectionsIcon from "@mui/icons-material/Directions";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate, useParams } from "react-router-dom";

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

  const doctor = {
    id: parseInt(doctorId),
    name: "Dr. Rahul Gupta",
    specialty: "Skin Specialist",
    clinic: "Gupta Skin and dental clinic",
    address: "Station Road, Alwar, Rajasthan",
    rating: 4.7,
    reviews: 543,
    experience: "15 years",
    education: "MBBS, MD (General Medicine)",
    about: "Dr. Rahul Gupta is a highly experienced skin specialist with over 15 years of practice. He specializes in treating various skin conditions, including acne, psoriasis, eczema, and skin allergies. Dr. Gupta is known for his patient-centric approach and dedication to providing personalized care.",
    timings: {
      mon: "9:00 AM - 1:00 PM",
      tue: "9:00 AM - 1:00 PM",
      wed: "9:00 AM - 1:00 PM",
      thu: "4:00 PM - 8:00 PM",
      fri: "4:00 PM - 8:00 PM",
      sat: "9:00 AM - 1:00 PM",
    },
    fees: "₹500 Consultation",
    currentToken: 8,
    yourToken: 15,
    estimatedWaitTime: "1hr 27 mins",
    phone: "+91 12345 67890",
  };

  // Calculate people ahead
  const getPeopleAhead = () => {
    return Math.max(0, doctor.yourToken - doctor.currentToken);
  };

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
        "Dr. Gupta is very professional and friendly. He addressed all my concerns and the treatment was effective. Highly recommend!",
    },
  ];

  // Simulating loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  const handleConfirmBooking = () => {
    setBookingLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingLoading(false);
      setBookingStage(2); // Success stage
    }, 1500);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(90vh)",
          overflowY: "auto",  
          mb:10
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading doctor profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 10, bgcolor: "#f9fafc", height: "calc(100vh - 130px)", overflowY: "auto" }}>
      {/* Doctor Information Card */}
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3, 
          mb: 2,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}
      >
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
              <Avatar 
                sx={{ 
                  bgcolor: "primary.main", 
                  width: 80, 
                  height: 80,
                  fontSize: "2rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                }}
              >
                {doctor.name.charAt(4)}
              </Avatar>
            </Grid>
            
            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {doctor.name}
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
                  {doctor.rating} • {doctor.reviews} reviews
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Chip
                  icon={<SchoolIcon fontSize="small" />}
                  label={doctor.experience}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
                />
                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label="English, Hindi"
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
                />
              </Stack>
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: "text.disabled" }} />
                  {doctor.clinic}, {doctor.address}
                </Typography>
                
                <ButtonGroup variant="outlined" size="small" sx={{ ml: 2 }}>
                  <Button
                    startIcon={<PhoneIcon />}
                    onClick={handleCall}
                    sx={{ borderRadius: '8px 0 0 8px', height: '32px', fontSize: '0.8rem' }}
                  >
                    Call
                  </Button>
                  <Button
                    startIcon={<DirectionsIcon />}
                    onClick={handleDirections}
                    sx={{ borderRadius: '0 8px 8px 0', height: '32px', fontSize: '0.8rem' }}
                  >
                    Map
                  </Button>
                </ButtonGroup>
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
                  {doctor.fees.split(" ")[0]}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  People Ahead
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" fontWeight="medium" color="primary.dark">
                    {getPeopleAhead()}
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                  />
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
            onClick={handleBookNow}
          >
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
          }}
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Reviews" icon={<StarIcon />} iconPosition="start" />
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
                {doctor.experience} of experience in {doctor.specialty}
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
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhoneIcon />}
                    onClick={handleCall}
                    sx={{ mr: 1, borderRadius: 2, height: '32px', fontSize: '0.8rem' }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DirectionsIcon />}
                    onClick={handleDirections}
                    sx={{ borderRadius: 2, height: '32px', fontSize: '0.8rem' }}
                  >
                    Map
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                {doctor.fees}
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
                  {doctor.rating} • {doctor.reviews} reviews
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 500 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {bookingStage === 0 && "Book Appointment"}
          {bookingStage === 1 && "Processing"}
          {bookingStage === 2 && "Appointment Confirmed"}
        </DialogTitle>
        
        <DialogContent>
          {bookingStage === 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                Appointment Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Doctor
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {doctor.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Specialty
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {doctor.specialty}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {days[selectedDay].date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Queue
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Token #{doctor.currentToken}
                  </Typography>
                </Grid>
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
              
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Appointment For</FormLabel>
                <RadioGroup
                  row
                  value={patientType}
                  onChange={handlePatientTypeChange}
                >
                  <FormControlLabel value="self" control={<Radio />} label="Myself" />
                  <FormControlLabel value="family" control={<Radio />} label="Family Member" />
                </RadioGroup>
              </FormControl>
              
              {patientType === "family" && (
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Family Member Name"
                        value={familyMember.name}
                        onChange={(e) => handleFamilyMemberChange('name', e.target.value)}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Relation"
                        value={familyMember.relation}
                        onChange={(e) => handleFamilyMemberChange('relation', e.target.value)}
                        required
                        size="small"
                        select
                      >
                        <MenuItem value="spouse">Spouse</MenuItem>
                        <MenuItem value="child">Child</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="sibling">Sibling</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={familyMember.age}
                        onChange={(e) => handleFamilyMemberChange('age', e.target.value)}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        value={familyMember.gender}
                        onChange={(e) => handleFamilyMemberChange('gender', e.target.value)}
                        required
                        size="small"
                        select
                      >
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                        <MenuItem value="O">Other</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <TextField
                fullWidth
                label="Health Issue / Symptoms"
                multiline
                rows={2}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                defaultValue="Skin Allergy"
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                By confirming this appointment, you agree to our terms and conditions. You will receive a token number for the queue. You can cancel your appointment up to 30 minutes before your expected turn.
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
          
          {bookingStage === 2 && (
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
              <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                {days[selectedDay].date} at {doctor.clinic}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <QueueIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  Token #15
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Your appointment details have been sent to your registered mobile number. Please arrive at the clinic before your token number is called.
              </Typography>
              <Box sx={{ 
                bgcolor: 'rgba(25,118,210,0.1)', 
                p: 2, 
                borderRadius: 2, 
                mt: 2, 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <Box sx={{ mr: 1.5, display: 'flex' }}>
                  <PeopleIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    People Ahead: {getPeopleAhead()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated wait time: {doctor.estimatedWaitTime}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {bookingStage === 0 && (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  setBookingStage(1);
                  handleConfirmBooking();
                }}
              >
                Confirm Appointment
              </Button>
            </>
          )}
          
          {bookingStage === 2 && (
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleNavigateToHome}
            >
              Go to Home
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorPage;
