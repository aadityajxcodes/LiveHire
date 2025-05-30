import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

const NotFound = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const goToDashboard = () => {
    if (userRole === 'company') {
      navigate('/company-dashboard');
    } else if (userRole === 'interviewer') {
      navigate('/interviewer-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{
            p: 5,
            borderRadius: 2,
            backgroundColor: '#f8f9fa',
            width: '100%',
            maxWidth: 500
          }}
        >
          <Typography variant="h1" color="primary" gutterBottom sx={{ fontSize: 120 }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
            
            {userRole && (
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<DashboardIcon />}
                onClick={goToDashboard}
              >
                Go to Dashboard
              </Button>
            )}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
