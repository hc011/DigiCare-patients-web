import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./Pages/Login";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./context/AuthContext";
import AppointmentBooking from "./patient-demo/AppointmentBooking";
import AppointmentsList from "./patient-demo/AppointmentsList";
import BottomNavigator from "./patient-demo/BottomNavigator";
import DoctorPage from "./patient-demo/DoctorPage";
import PatientHome from "./patient-demo/PatientHome";
import ProfilePage from "./patient-demo/ProfilePage";
import SearchDoctors from "./patient-demo/SearchDoctors";
import Register from "./Pages/Register";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import InstallPrompt from "./components/InstallPrompt";

const App = () => {
  const { user } = useContext(AuthContext);
  const isMobile = window.innerWidth <= 768;

  // Mock data - replace with real data management
  const [appointments, setAppointments] = useState([]);

  const [maxToken, setMaxToken] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);

  const [doctors] = useState([
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
  ]);
  useEffect(() => {
    // Initialize mock appointments
    setAppointments([
      {
        id: 1,
        doctor: "Dr. Rahul Gupta",
        date: "2024-03-20 09:00",
        status: "upcoming",
        clinic: "Gupta Skin and dental clinic",
        specialty: "Cardiology",
      },
    ]);
  }, []);

  return (
    <Router>
      <div className="App" style={{ height: "100vh", overflow: "hidden" }}>
        {user !== null && <Header />}
        <Box sx={{ display: "flex", height: "100%" }}>
          <Box
            component="main"
            sx={{ flexGrow: 1, height: "100%", width: "100%" }}
          >
            <Routes>
              <Route
                path="/login"
                element={user ? <Navigate to="/patient" replace /> : <Login />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />

              {/* Patient Routes */}
              <Route
                path="/patient"
                element={
                  <PrivateRoute>
                    <PatientHome appointments={appointments} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <SearchDoctors doctors={doctors} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/doctor/:doctorId"
                element={
                  <PrivateRoute>
                    <DoctorPage
                      doctors={doctors}
                      maxToken={maxToken}
                      refreshTokenFn={setRefreshToken}
                    />
                  </PrivateRoute>
                }
              />

              <Route
                path="/book-appointment/:doctorId"
                element={
                  <PrivateRoute>
                    <AppointmentBooking
                      appointments={appointments}
                      setAppointments={setAppointments}
                    />
                  </PrivateRoute>
                }
              />

              <Route
                path="/appointments"
                element={
                  <PrivateRoute>
                    <AppointmentsList appointments={appointments} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Box>
        </Box>
        {/* {user !== null && isMobile && <BottomNavigator />} */}
        <InstallPrompt isLoggedIn={user !== null} />
      </div>
    </Router>
  );
};

export default App;
