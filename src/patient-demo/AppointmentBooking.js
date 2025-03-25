import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { addAppointment } from "../services/api";

const steps = ["Select Time", "Details", "Confirmation"];

const AppointmentBooking = () => {
    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [searchParams] = useSearchParams();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        dateTime: searchParams.get("slot") || "",
        reason: "",
        notes: "",
    });

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        try {
            // Prepare appointment data according to API requirements
            const appointmentData = {
                cabinId: parseInt(doctorId),
                slot: formData.dateTime,
                name: "User Name", // Replace with actual user name from context
                disease: formData.reason || "",
                appointment_type: "New",
                phone_number: "9352712911", // Replace with actual user phone from context
                age: "25", // Replace with actual user age from context
                gender: "M", // Replace with actual user gender from context
                location: "",
                guardian: "",
                fees_paid: 0,
                mode: "",
                paid: false,
                checkin: false
            };

            // Call the API to save appointment
            const response = await addAppointment(appointmentData);
            console.log("Appointment saved:", response);

            navigate("/patient", { state: { bookingSuccess: true } });
        } catch (error) {
            console.error("Error booking appointment:", error);
            // TODO: Show error message to user
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <DateTimePicker
                        label="Select Appointment Time"
                        value={formData.dateTime}
                        onChange={(newValue) =>
                            setFormData({ ...formData, dateTime: newValue })
                        }
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDateTime={new Date()}
                    />
                </Paper>
            )}

            {activeStep === 1 && (
                <Box component="form">
                    <TextField
                        fullWidth
                        label="Reason for Visit"
                        variant="outlined"
                        margin="normal"
                        value={formData.reason}
                        onChange={(e) =>
                            setFormData({ ...formData, reason: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Additional Notes"
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                    />
                </Box>
            )}

            {activeStep === 2 && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Typography variant="h6" gutterBottom>
                        Confirm Details
                    </Typography>
                    <Typography variant="body2" paragraph>
                        <strong>Date & Time:</strong>{" "}
                        {new Date(formData.dateTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" paragraph>
                        <strong>Reason:</strong> {formData.reason}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Notes:</strong> {formData.notes || "None"}
                    </Typography>
                </Paper>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        color="success"
                    >
                        Confirm Booking
                    </Button>
                ) : (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default AppointmentBooking;