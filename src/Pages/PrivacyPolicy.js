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

const PrivacyPolicy = () => {
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
          Privacy Policy
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
              Privacy Policy
            </Typography>
            
            <Typography variant="body1" paragraph>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>

            <Typography variant="body1" paragraph>
              DigiCare ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare appointment booking application.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Information We Collect
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Personal Information"
                  secondary="Name, phone number, email address, and other contact details"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Health Information"
                  secondary="Medical conditions, symptoms, and appointment details you provide"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Technical Information"
                  secondary="Device information, IP address, and usage data"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              How We Use Your Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Appointment Management"
                  secondary="To schedule, modify, and manage your medical appointments"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Communication"
                  secondary="To send appointment confirmations, reminders, and important updates"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Service Improvement"
                  secondary="To analyze and improve our services and user experience"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Information Sharing
            </Typography>
            <Typography variant="body1" paragraph>
              We share your information only with:
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Healthcare Providers"
                  secondary="Doctors and clinic staff involved in your care"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Service Providers"
                  secondary="Third-party services that help us operate our platform"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Legal Requirements"
                  secondary="When required by law or to protect our rights"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Your Rights
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Access"
                  secondary="You can request access to your personal information"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Correction"
                  secondary="You can request correction of inaccurate information"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Deletion"
                  secondary="You can request deletion of your information"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@digicare.com
              <br />
              Phone: 1-800-DIGICARE
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy; 