import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Payments as PaymentsIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

const DoctorPage = ({ doctors }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [openBooking, setOpenBooking] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    symptoms: "",
  });

  const doctor = doctors.find((d) => d.id === parseInt(doctorId));

  const handleBookAppointment = () => {
    console.log("Booking appointment:", formData);
    setOpenBooking(false);
    navigate("/patient");
  };

  if (!doctor) return <Typography variant="h6">Doctor not found</Typography>;

  return (
    <Box
      sx={{
        p: 2,
        pb: 8,
        height: "calc(80vh - 130px)", // Adjust based on your header/nav height
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Doctor Profile Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mr: 2,
            bgcolor: "#1976d2",
            fontSize: "2rem",
          }}
        >
          {doctor.name[0]}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {doctor.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {doctor.specialty}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating
              value={doctor.rating}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({doctor.rating}/5)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Current Status Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "#e3f2fd",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ScheduleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Current Token: #{doctor.currentToken}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Estimated waiting time: ~30 minutes
        </Typography>
      </Paper>

      {/* Clinic Information */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}
      >
        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <LocationIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Clinic Address" secondary={doctor.address} />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <WorkIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Experience"
            secondary={`${doctor.experience} experience`}
          />
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemIcon>
            <SchoolIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Qualifications" secondary={doctor.education} />
        </ListItem>
      </Paper>

      {/* Weekly Schedule */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Weekly Schedule
        </Typography>
        {Object.entries(doctor.timings).map(([day, time]) => (
          <Box
            key={day}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              p: 1,
              bgcolor: "white",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{ textTransform: "capitalize", fontWeight: 500 }}
            >
              {day}
            </Typography>
            <Typography variant="body1">{time || "Closed"}</Typography>
          </Box>
        ))}
      </Paper>

      {/* Fees and Contact */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PaymentsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Consultation Fees: {doctor.fees}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PhoneIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">Clinic Phone: {doctor.phone}</Typography>
        </Box>
      </Paper>

      {/* Book Appointment Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 72, sm: 24 }, // Adjust for mobile navigation
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 600,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 4,
            boxShadow: 3,
            textTransform: "none",
            "&:hover": {
              boxShadow: 5,
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => setOpenBooking(true)}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Booking Dialog */}
      <Dialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          New Appointment Request
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Patient Full Name"
              margin="normal"
              required
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                required
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />

              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Symptoms/Health Concerns"
              multiline
              rows={3}
              margin="normal"
              required
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
              sx={{ mt: 3 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
              onClick={handleBookAppointment}
            >
              Confirm Booking
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorPage;
