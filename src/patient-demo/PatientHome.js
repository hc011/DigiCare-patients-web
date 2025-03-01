import React from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PatientHome = ({ appointments }) => {
  const navigate = useNavigate();
  const currentAppointment = appointments.find(
    (app) => app.status === "upcoming"
  );

  return (
    <Box sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Current Status
      </Typography>

      {currentAppointment ? (
        <Paper elevation={3} sx={{ p: 2, mb: 3, mt: 2, pt: 2, pb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            {currentAppointment.clinic}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Doctor: {currentAppointment.doctor}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <div>
              <Typography variant="caption">Your Token</Typography>
              <Typography variant="h4">A{currentAppointment.id}</Typography>
            </div>
            <div>
              <Typography variant="caption">Current Token</Typography>
              <Typography variant="h4">A{currentAppointment.id - 1}</Typography>
            </div>
          </Box>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Box
              sx={{
                mt: 2,
                padding: 2,
                backgroundColor: "#e8f5e9",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  marginRight: 1,
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(0.95)", opacity: 0.7 },
                    "70%": { transform: "scale(1.5)", opacity: 0 },
                    "100%": { transform: "scale(0.95)", opacity: 0.7 },
                  },
                }}
              />
              <Typography variant="body2">
                Estimated Waiting Time:{" "}
                {currentAppointment.currentWaitTime || "~20 mins"}
              </Typography>{" "}
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 6 }}
              onClick={() => navigate("/appointments")}
            >
              View All Appointments
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ p: 2 }}>
          No upcoming appointments
        </Typography>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate("/search")}
        sx={{ mt: 10, py: 2 }}
      >
        Book New Appointment
      </Button>
    </Box>
  );
};

export default PatientHome;
