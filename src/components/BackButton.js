import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Pages where the back button should be visible
const PAGES_WITH_BACK_BUTTON = [
    '/doctor',
    '/search',
    '/register',
    '/appointments'
];

// Pages that are navigation roots (no back button needed)
const ROOT_PAGES = [
    '/patient-home',
    '/patient'
];

const BackButton = ({ sx = {} }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // Check if current path should have back button
        const shouldShowBackButton = PAGES_WITH_BACK_BUTTON.some(path =>
            location.pathname.startsWith(path)
        );

        // Check if user can go back in history
        const hasHistory = window.history.length > 1;

        // Check if current path is a root page
        const isRootPage = ROOT_PAGES.some(path =>
            location.pathname === path || location.pathname.startsWith(path)
        );

        // Show back button if we're on a page that should have it AND we can go back
        // AND we're not on a root page
        setCanGoBack(shouldShowBackButton && hasHistory && !isRootPage);
    }, [location]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!canGoBack) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', mb: 2, ...sx }}>
            <IconButton
                onClick={handleGoBack}
                sx={{
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderRadius: '50%',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.12)'
                    }
                }}
            >
                <ArrowBackIcon />
            </IconButton>
        </Box>
    );
};

export default BackButton;