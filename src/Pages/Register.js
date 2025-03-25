import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { updateUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
        password: ''
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
            setErrors(prev => ({ ...prev, [name]: '' }));
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
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const updatePayload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password
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

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f5f7fa',
            display: 'flex',
            flexDirection: 'column',
            p: 0
        }}>
            {/* Header */}
            <Box sx={{
                bgcolor: '#1976d2',
                color: 'white',
                py: 2,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <IconButton color="inherit" onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Complete Your Profile
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ 
                py: 4, 
                flexGrow: 1,
                p: 0,
                '& .MuiContainer-root': {
                    p: 0
                }
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        bgcolor: 'white'
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
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
                                <Button
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ 
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register; 