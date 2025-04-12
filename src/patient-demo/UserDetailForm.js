import {
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/DigiCare__logo.png";

const UserDetailForm = ({ open, onClose, onSubmit }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        age: '',
        gender: '',
        guardian: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 150) {
            newErrors.age = 'Please enter a valid age';
        }
        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
                <DialogTitle sx={{ p: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                        src={logo}
                        alt="Digicare Logo"
                        style={{ height: 40, width: 'auto' }}
                    />
                    Complete Your Profile
                </DialogTitle>
            </Box>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
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

                        <Grid item xs={12} sm={6}>
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                error={!!errors.location}
                                helperText={errors.location}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                error={!!errors.age}
                                helperText={errors.age}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                error={!!errors.gender}
                                helperText={errors.gender}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Guardian Name (Optional)"
                                name="guardian"
                                value={formData.guardian}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button
                    onClick={() => {
                        onClose();
                        navigate('/login');
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Complete Profile
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailForm;