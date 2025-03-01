import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";

export default function BottomNavigator() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToIndex = {
    "/patient": 0,
    "/search": 1,
    "/appointments": 2,
    "/profile": 3,
  };

  const [value, setValue] = React.useState(pathToIndex[location.pathname] || 0);

  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          const paths = ["/patient", "/search", "/appointments", "/profile"];
          navigate(paths[newValue]);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction
          label="Appointments"
          icon={<CalendarTodayIcon />}
        />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
}
