import DirectionsIcon from "@mui/icons-material/Directions";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Rating,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorList } from "../services/api";

const SearchDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doctorCardLoading, setDoctorCardLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  const specialtyTabs = [
    "All",
    "Skin",
    "Pediatrics",
    "Cardiology",
    "Dentistry",
    "Orthopedics"
  ];

  // Existing doctors list
  const existingDoctors = [
    {
      id: 4,
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
    // ... rest of your existing doctors array ...
  ];

  // Fetch doctors from API and combine with existing doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Set existing doctors first to show something immediately
        setDoctors(existingDoctors);
        
        const response = await getDoctorList();
        if (response && Array.isArray(response)) {
          // Transform API response to match existing structure
          const transformedDoctors = response.map(item => ({
            id: item.id,
            name: item.doctor.name,
            specialty: item.doctor.specialization,
            clinic: item.hospital.hospital_name,
            address: item.hospital.map_location || "Address not available",
            rating: parseFloat(item.doctor.rating) || 4.5,
            experience: `${item.doctor.experience} years`,
            education: "MBBS", // Default value since not in API
            timings: {
              mon: "9:00 AM - 1:00 PM",
              tue: "9:00 AM - 1:00 PM",
              wed: "9:00 AM - 1:00 PM",
              thu: "4:00 PM - 8:00 PM",
              fri: "4:00 PM - 8:00 PM",
              sat: "9:00 AM - 1:00 PM",
            },
            fees: `₹${item.fees} Consultation`,
            currentToken: 15, // Default value since not in API
            phone: item.doctor.phone_number,
          }));

          // Combine existing doctors with API doctors, avoiding duplicates by ID
          const combinedDoctors = [...existingDoctors];
          transformedDoctors.forEach(apiDoctor => {
            if (!combinedDoctors.some(existingDoctor => existingDoctor.id === apiDoctor.id)) {
              combinedDoctors.push(apiDoctor);
            }
          });

          setDoctors(combinedDoctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // If API fails, keep showing existing doctors
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter by tab and search term with null checks
  const filteredDoctors = doctors.filter(
    (doctor) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (doctor.name?.toLowerCase() || "").includes(searchTermLower) ||
        (doctor.specialty?.toLowerCase() || "").includes(searchTermLower) ||
        (doctor.clinic?.toLowerCase() || "").includes(searchTermLower);
      
      const matchesTab = 
        selectedTab === 0 || // "All" tab
        (doctor.specialty?.toLowerCase() || "").includes(specialtyTabs[selectedTab].toLowerCase());
      
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
      {/* <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
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
      </Box> */}

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
