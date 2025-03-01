import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const SearchDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialty: "General Physician",
      clinic: "Alwar City Clinic",
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

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWaitTime = (currentToken) => {
    const avgConsultationTime = 10; // minutes per patient
    const totalMinutes = currentToken * avgConsultationTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Box
      sx={{
        p: 1,
        height: "calc(90vh - 90px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search doctors, specialties, clinics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, borderRadius: 3 }}
      />

      <Box sx={{ flex: 1, overflowY: "auto", pr: 1, pb: 5, pt: 2 }}>
        <Stack spacing={2}>
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
              onClick={() => navigate(`/doctor/${doctor.id}`)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                    {doctor.name[4]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {doctor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                  </Box>
                  <Chip
                    label={`★ ${doctor.rating}`}
                    color="primary"
                    variant="outlined"
                    icon={<StarIcon fontSize="small" />}
                  />
                </Box>

                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MedicalServicesIcon color="primary" fontSize="small" />
                    <Typography variant="body2">{doctor.clinic}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ScheduleIcon color="primary" fontSize="small" />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Chip
                        label={`Token #${doctor.currentToken}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`Wait Time: ${getWaitTime(doctor.currentToken)}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                      fontWeight: 500,
                    }}
                  >
                    {doctor.fees.replace("Consultation", "").trim()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default SearchDoctors;
