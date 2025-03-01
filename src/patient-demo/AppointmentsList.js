import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const AppointmentsList = () => {
  const navigate = useNavigate();

  // Mock data - replace with API call
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Smith",
      date: "2024-02-20 09:00",
      status: "upcoming",
      clinic: "City Health Clinic",
      specialty: "Cardiology",
    },
    {
      id: 2,
      doctor: "Dr. John Doe",
      date: "2024-01-15 14:30",
      status: "completed",
      clinic: "Central Hospital",
      specialty: "Orthopedics",
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        My Appointments
      </Typography>

      <List>
        {appointments.map((appointment) => (
          <Paper
            key={appointment.id}
            elevation={0}
            sx={{ mb: 2, bgcolor: "#f5f5f5" }}
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
                      {new Date(appointment.date).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      {appointment.clinic} - {appointment.specialty}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {appointment.status === "upcoming" && (
              <>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/doctor/${appointment.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default AppointmentsList;
