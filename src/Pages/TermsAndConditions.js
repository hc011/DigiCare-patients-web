import React from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f7fa',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1200
    }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#1976d2',
        color: 'white',
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: 1
      }}>

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Terms and Conditions
        </Typography>
      </Box>

      <Box sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        pb: isMobile ? 8 : 2 // Add padding bottom for mobile to account for bottom navigator
      }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Terms and Conditions
            </Typography>
            
            <Typography variant="body1" paragraph>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>

            <Typography variant="body1" paragraph>
              Please read these Terms and Conditions carefully before using the DigiCare appointment booking application.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing or using DigiCare, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Appointment Booking Service
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="2.1 Booking Process"
                  secondary="Users must provide accurate information when booking appointments. False information may result in appointment cancellation."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2.2 Cancellation Policy"
                  secondary="Appointments can be cancelled or rescheduled up to 4 hours before the scheduled time. Late cancellations may incur fees."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2.3 Payment Terms"
                  secondary="Payment for services must be made at the clinic unless specified otherwise. We do not process payments through the application."
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. User Responsibilities
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="3.1 Account Security"
                  secondary="Users are responsible for maintaining the confidentiality of their account information."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="3.2 Accurate Information"
                  secondary="Users must provide accurate personal and medical information."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="3.3 Timely Arrival"
                  secondary="Users must arrive at the clinic before their scheduled appointment time."
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. Medical Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
              The application is for appointment booking only and does not provide medical advice. Always consult qualified healthcare providers for medical decisions.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              5. Service Availability
            </Typography>
            <Typography variant="body1" paragraph>
              We strive to provide uninterrupted service but cannot guarantee 100% availability. We are not liable for any losses due to service interruptions.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              6. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              DigiCare is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              7. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              8. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              For questions about these Terms and Conditions, please contact us at:
              <br />
              Email: legal@digicare.com
              <br />
              Phone: 1-800-DIGICARE
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default TermsAndConditions; 