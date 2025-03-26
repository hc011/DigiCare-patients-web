import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import BackButton from "../components/BackButton";
import { AuthContext } from '../context/AuthContext';
import { updateUser } from '../services/api';

const Register = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        terms: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const userData = location.state?.userData;
        if (!userData) {
            handleLogoutAndRedirect();
        }
    }, [location]);

    const handleLogoutAndRedirect = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('appointmentslist');
        setUser(null);
        navigate('/login', { replace: true });
    };

    const handleBack = () => {
        handleLogoutAndRedirect();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.terms) newErrors.terms = 'You must agree to the terms of service';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const updatePayload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            };

            const response = await updateUser(updatePayload);
            console.log("User update response:", response);

            const userData = location.state?.userData;
            const updatedUserData = {
                ...userData,
                user: {
                    ...userData.user,
                    ...updatePayload
                }
            };

            localStorage.setItem("user", JSON.stringify(updatedUserData));
            setUser(updatedUserData);
            navigate("/patient", { state: { freshLogin: true } }, { replace: true });
        } catch (error) {
            console.error("Error updating user details:", error);
            setSnackbar({
                open: true,
                message: "Failed to update profile. Please try again.",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box sx={{ p: 2, height: "100%" }}>
            <BackButton />
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: "500px",
                    mx: "auto",
                    mt: 5,
                    mb: 10,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    bgcolor: "background.paper",
                }}
            >
                <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Typography variant="h5" component="h1" fontWeight="700" gutterBottom>
                        Create an Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign up to access all the features of DigiCare
                    </Typography>
                </Box>

                {/* Form fields */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={toggleShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    name="terms"
                                    color="primary"
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    I agree to the{" "}
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle terms link click
                                        }}
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle privacy link click
                                        }}
                                    >
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            }
                        />
                        {errors.terms && (
                            <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                                {errors.terms}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Register;