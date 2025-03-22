import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from "@mui/material";
import {
  Person,
  Lock,
  MedicalInformation,
  History,
  Email,
  Phone,
  LocationOn,
  Cake,
  Favorite,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Dummy medical records
  const medicalRecords = [
    { date: "2024-03-15", doctor: "Dr. Sharma", diagnosis: "Common Cold" },
    { date: "2024-02-28", doctor: "Dr. Gupta", diagnosis: "Dental Checkup" },
  ];

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 800,
        margin: "0 auto",
        height: "calc(90vh - 130px)",
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 3 }}>
        <Avatar
          sx={{
            width: 96,
            height: 96,
            fontSize: "2.5rem",
            bgcolor: "primary.main",
          }}
        >
          {"H"}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Himanshu Chauhan
          </Typography>
          <Chip
            label="Patient"
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab icon={<Person />} label="Account" />
        <Tab icon={<MedicalInformation />} label="Medical" />
        <Tab icon={<Lock />} label="Security" />
      </Tabs>

      {activeTab === 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            <Person sx={{ verticalAlign: "middle", mr: 1 }} />
            Personal Information
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={"himanshu@gmail.com"} />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Phone"
                secondary={user?.phone || "+91 98765 43210"}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <LocationOn color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Address"
                secondary={user?.address || "123 Main Street, Alwar"}
              />
            </ListItem>
          </List>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            <MedicalInformation sx={{ verticalAlign: "middle", mr: 1 }} />
            Medical Information
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Cake color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Date of Birth"
                secondary="January 1, 1990"
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <Favorite color="primary" />
              </ListItemIcon>
              <ListItemText primary="Blood Group" secondary="O+" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            <History sx={{ verticalAlign: "middle", mr: 1 }} />
            Medical History
          </Typography>

          {medicalRecords.map((record, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                {record.diagnosis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {record.date} • {record.doctor}
              </Typography>
            </Paper>
          ))}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            <Lock sx={{ verticalAlign: "middle", mr: 1 }} />
            Security Settings
          </Typography>

          <List>
            <ListItem button>
              <ListItemText
                primary="Change Password"
                secondary="Last changed 3 months ago"
              />
            </ListItem>
            <Divider />

            <ListItem button>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Not enabled"
              />
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ProfilePage;
