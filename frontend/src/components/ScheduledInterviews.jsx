import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScheduledInterviews();
  }, []);

  const fetchScheduledInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5001/api/interviews/scheduled',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterviews(response.data);
    } catch (err) {
      console.error('Error fetching scheduled interviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinInterview = (interviewId) => {
    navigate(`/live-interview/${interviewId}`);
  };

  const handleScheduleNew = () => {
    navigate('/schedule-interview');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'cancelled': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{ color: '#0057b7', fontWeight: 'bold' }}>
          Scheduled Interviews
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleScheduleNew}
          sx={{
            backgroundColor: '#0057b7',
            '&:hover': { backgroundColor: '#004494' }
          }}
        >
          Schedule New Interview
        </Button>
      </Box>

      <Grid container spacing={3}>
        {interviews.map((interview) => (
          <Grid item xs={12} md={6} lg={4} key={interview._id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#0057b7', mr: 1 }} />
                  <Typography variant="h6">
                    {interview.candidate.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ color: '#666', mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(interview.schedule.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#666', mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {interview.schedule.startTime} ({interview.schedule.duration} mins)
                  </Typography>
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  {interview.jobDetails.title}
                </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Chip
                    label={getStatusText(interview.status)}
                    sx={{
                      backgroundColor: getStatusColor(interview.status),
                      color: 'white'
                    }}
                  />
                </Box>

                <Box sx={{ 
                  mt: 'auto', 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  pt: 2
                }}>
                  <Button
                    variant="contained"
                    startIcon={<VideoCallIcon />}
                    onClick={() => handleJoinInterview(interview._id)}
                    disabled={interview.status !== 'accepted'}
                    sx={{
                      backgroundColor: '#0057b7',
                      '&:hover': { backgroundColor: '#004494' },
                      '&.Mui-disabled': {
                        backgroundColor: '#e0e0e0'
                      }
                    }}
                  >
                    Join Interview
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {interviews.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 4,
            p: 4,
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No interviews scheduled
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleScheduleNew}
            sx={{
              mt: 2,
              backgroundColor: '#0057b7',
              '&:hover': { backgroundColor: '#004494' }
            }}
          >
            Schedule Your First Interview
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ScheduledInterviews; 