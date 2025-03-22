import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  CardContent,
  Box,
  Typography,
  InputAdornment,
  Avatar,
  Chip,
  Stack,
  Tabs,
  Tab,
  Grid,
  IconButton,
  LinearProgress,
  Divider,
  Button,
  Rating,
  CircularProgress,
  Skeleton,
  Fade,
  ButtonGroup
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterListIcon from "@mui/icons-material/FilterList";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const SearchDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doctorCardLoading, setDoctorCardLoading] = useState(false);

  const specialtyTabs = [
    "All",
    "Skin",
    "Pediatrics",
    "Cardiology",
    "Dentistry",
    "Orthopedics"
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Rahul Gupta",
      specialty: "Skin Specialist",
      clinic: "Gupta Skin and dental clinic",
      address: "Station Road, Alwar, Rajasthan",
      rating: 4.7,
      experience: "15 years",
      education: "MBBS, MD (General Medicine)",
      timings: {
        mon: "9:00 AM - 1:00 PM",
        tue: "9:00 AM - 1:00 PM",
        wed: "9:00 AM - 1:00 PM",
        thu: "4:00 PM - 8:00 PM",
        fri: "4:00 PM - 8:00 PM",
        sat: "9:00 AM - 1:00 PM",
      },
      fees: "₹500 Consultation",
      currentToken: 15,
      phone: "+91 12345 67890",
    },
    {
      id: 2,
      name: "Dr. Priya Singh",
      specialty: "Pediatrics",
      clinic: "Sardar Hospital",
      address: "Bhiwadi Road, Alwar",
      rating: 4.9,
      experience: "12 years",
      education: "MBBS, DCH",
      timings: {
        mon: "10:00 AM - 4:00 PM",
        tue: "10:00 AM - 4:00 PM",
        wed: "10:00 AM - 4:00 PM",
        thu: "10:00 AM - 4:00 PM",
        fri: "10:00 AM - 4:00 PM",
        sat: "10:00 AM - 1:00 PM",
      },
      fees: "₹700 Consultation",
      currentToken: 22,
      phone: "+91 98765 43210",
    },
    {
      id: 3,
      name: "Dr. R.K. Gupta",
      specialty: "Cardiology",
      clinic: "Alwar Heart Center",
      address: "Near Bus Stand, Alwar",
      rating: 4.8,
      experience: "18 years",
      education: "MBBS, DM Cardiology",
      timings: {
        mon: "8:00 AM - 12:00 PM",
        tue: "8:00 AM - 12:00 PM",
        wed: "4:00 PM - 8:00 PM",
        thu: "4:00 PM - 8:00 PM",
        fri: "8:00 AM - 12:00 PM",
        sat: "9:00 AM - 1:00 PM",
      },
      fees: "₹800 Consultation",
      currentToken: 9,
      phone: "+91 78965 41230",
    },
    {
      id: 4,
      name: "Dr. Neha Jain",
      specialty: "Dermatology",
      clinic: "Skin Care Clinic",
      address: "MIA Road, Alwar",
      rating: 4.6,
      experience: "10 years",
      education: "MBBS, MD Dermatology",
      timings: {
        mon: "10:00 AM - 2:00 PM",
        tue: "10:00 AM - 2:00 PM",
        wed: "3:00 PM - 7:00 PM",
        thu: "3:00 PM - 7:00 PM",
        fri: "10:00 AM - 2:00 PM",
        sat: "Closed",
      },
      fees: "₹600 Consultation",
      currentToken: 5,
      phone: "+91 88754 63210",
    },
    {
      id: 5,
      name: "Dr. Sanjay Verma",
      specialty: "Orthopedics",
      clinic: "Bone & Joint Care",
      address: "Bhiwadi Road, Alwar",
      rating: 4.5,
      experience: "14 years",
      education: "MBBS, MS Orthopedics",
      timings: {
        mon: "9:00 AM - 1:00 PM",
        tue: "4:00 PM - 8:00 PM",
        wed: "9:00 AM - 1:00 PM",
        thu: "4:00 PM - 8:00 PM",
        fri: "9:00 AM - 1:00 PM",
        sat: "10:00 AM - 2:00 PM",
      },
      fees: "₹700 Consultation",
      currentToken: 12,
      phone: "+91 99887 44556",
    },
    {
      id: 6,
      name: "Dr. Anjali Mehta",
      specialty: "Gynecology",
      clinic: "Women's Wellness Center",
      address: "Rajiv Gandhi Marg, Alwar",
      rating: 4.8,
      experience: "16 years",
      education: "MBBS, DGO",
      timings: {
        mon: "10:00 AM - 2:00 PM",
        tue: "10:00 AM - 2:00 PM",
        wed: "3:00 PM - 7:00 PM",
        thu: "3:00 PM - 7:00 PM",
        fri: "10:00 AM - 2:00 PM",
        sat: "9:00 AM - 1:00 PM",
      },
      fees: "₹750 Consultation",
      currentToken: 7,
      phone: "+91 91234 56789",
    },
    {
      id: 7,
      name: "Dr. Vikram Singh",
      specialty: "Dentistry",
      clinic: "Alwar Dental Care",
      address: "Near Gandhi Circle, Alwar",
      rating: 4.4,
      experience: "8 years",
      education: "BDS, MDS",
      timings: {
        mon: "9:00 AM - 7:00 PM",
        tue: "9:00 AM - 7:00 PM",
        wed: "9:00 AM - 7:00 PM",
        thu: "9:00 AM - 7:00 PM",
        fri: "9:00 AM - 7:00 PM",
        sat: "9:00 AM - 3:00 PM",
      },
      fees: "₹400 Consultation",
      currentToken: 3,
      phone: "+91 77665 44332",
    },
    {
      id: 8,
      name: "Dr. Arvind Yadav",
      specialty: "Ayurveda",
      clinic: "Prakriti Ayurvedic Center",
      address: "Neemrana Road, Alwar",
      rating: 4.6,
      experience: "20 years",
      education: "BAMS, MD Ayurveda",
      timings: {
        mon: "7:00 AM - 11:00 AM",
        tue: "7:00 AM - 11:00 AM",
        wed: "4:00 PM - 8:00 PM",
        thu: "4:00 PM - 8:00 PM",
        fri: "7:00 AM - 11:00 AM",
        sat: "7:00 AM - 11:00 AM",
      },
      fees: "₹300 Consultation",
      currentToken: 18,
      phone: "+91 92345 67890",
    },
  ];
  
  // Load doctors with a delay to simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter by tab and search term
  const filteredDoctors = doctors.filter(
    (doctor) => {
      const matchesSearch = 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        selectedTab === 0 || // "All" tab
        doctor.specialty.toLowerCase().includes(specialtyTabs[selectedTab].toLowerCase());
      
      return matchesSearch && matchesTab;
    }
  );

  // Calculate people ahead of you
  const getPeopleAhead = (currentToken, totalPatients = 25) => {
    return Math.max(0, totalPatients - currentToken);
  };

  const getWaitTime = (currentToken) => {
    const avgConsultationTime = 10; // minutes per patient
    const totalMinutes = currentToken * avgConsultationTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}hr ${minutes > 0 ? minutes + 'min' : ''}`;
    } else {
      return `${minutes}min`;
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleDoctorClick = (doctorId) => {
    setDoctorCardLoading(true);
    
    // Simulate loading delay before navigation
    setTimeout(() => {
      setDoctorCardLoading(false);
      navigate(`/doctor/${doctorId}`);
    }, 500);
  };
  
  const handleCall = (event, phone) => {
    event.stopPropagation(); // Prevent card click
    window.open(`tel:${phone}`);
  };

  const handleDirections = (event, address) => {
    event.stopPropagation(); // Prevent card click
    window.open(`https://maps.google.com/?q=${address}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box
      sx={{
        p: 2,
        pb: 8,
        height: "calc(100vh - 130px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9fafc"
      }}
    >
      {/* Doctor Card Loading Overlay */}
      {doctorCardLoading && (
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
          <Typography variant="h6" sx={{ mt: 2 }}>Opening doctor profile...</Typography>
        </Box>
      )}
    
      {/* Search bar */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search doctors, specialties, clinics..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 3, 
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }}
        />
      </Box>

      {/* Specialty tabs */}
      <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem'
            }
          }}
        >
          {specialtyTabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
      </Box>

      {/* Loading progress */}
      {loading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {/* Doctor list */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1, pb: 5 }}>
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, bgcolor: '#f5f9ff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Skeleton width={120} height={24} />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Skeleton variant="circular" width={60} height={60} />
                      </Grid>
                      <Grid item xs>
                        <Skeleton width="70%" height={28} />
                        <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                        <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Skeleton width="80%" height={40} />
                      </Grid>
                      <Grid item xs={4}>
                        <Skeleton width="80%" height={40} />
                      </Grid>
                      <Grid item xs={4}>
                        <Skeleton width="80%" height={40} />
                      </Grid>
                    </Grid>
                    <Skeleton width="100%" height={30} sx={{ mt: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : filteredDoctors.length === 0 ? (
          <Fade in={!loading}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No doctors found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in={!loading}>
            <Stack spacing={2}>
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: "all 0.2s",
                    border: '1px solid rgba(0,0,0,0.05)',
                    "&:hover": { 
                      transform: "translateY(-4px)",
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                    "&:active": {
                      transform: "translateY(-2px)",
                    },
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDoctorClick(doctor.id)}
                >
                  <CardContent sx={{ p: 0 }}>
                    {/* Header with specialty */}
                    <Box sx={{ p: 2, bgcolor: '#f5f9ff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Chip 
                        icon={<MedicalServicesIcon fontSize="small" />} 
                        label={doctor.specialty}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(25, 118, 210, 0.1)', 
                          color: 'primary.main',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    {/* Doctor details */}
                    <Box sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Avatar 
                            sx={{ 
                              bgcolor: "primary.main", 
                              width: 60, 
                              height: 60,
                              fontSize: '1.5rem'
                            }}
                          >
                            {doctor.name.charAt(4)}
                          </Avatar>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {doctor.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Rating 
                              value={doctor.rating} 
                              precision={0.1} 
                              size="small" 
                              readOnly 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {doctor.rating} • {doctor.experience} exp
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.disabled' }} />
                            {doctor.clinic}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Divider />
                    
                    {/* Additional info */}
                    <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                      <Grid container>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Next Available
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="primary">
                              Today
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Wait Time
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="primary">
                              {getWaitTime(doctor.currentToken)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Fees
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="primary">
                              {doctor.fees.split(' ')[0]}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {/* Queue status */}
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Current Queue
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(100, (doctor.currentToken / 25) * 100)} 
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ButtonGroup variant="outlined" size="small">
                        <Button
                          startIcon={<PhoneIcon />}
                          onClick={(e) => handleCall(e, doctor.phone)}
                          sx={{ borderRadius: '8px 0 0 8px', height: '32px', fontSize: '0.8rem' }}
                        >
                          Call
                        </Button>
                        <Button
                          startIcon={<DirectionsIcon />}
                          onClick={(e) => handleDirections(e, doctor.address)}
                          sx={{ borderRadius: '0 8px 8px 0', height: '32px', fontSize: '0.8rem' }}
                        >
                          Map
                        </Button>
                      </ButtonGroup>

                      <Button
                        variant="contained"
                        sx={{ 
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default SearchDoctors;
