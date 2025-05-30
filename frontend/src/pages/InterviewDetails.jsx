import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Mock data for demonstration purposes
const mockInterviewData = {
  _id: "mock123456",
  roomId: "live-interview-room-789",
  status: "accepted",
  schedule: {
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: new Date().getHours() < 12 ? "11:00 AM" : "03:00 PM", // Dynamic based on current time
    duration: 60
  },
  interviewer: {
    _id: "interviewer123",
    name: "Alex Johnson",
    email: "alex@example.com",
    skills: ["JavaScript", "React", "Node.js", "System Design"],
    rating: 4.8
  },
  company: {
    _id: "company456",
    companyName: "TechInnovate Solutions",
    industry: "Software Development",
    email: "hr@techinnovate.com"
  },
  candidate: {
    name: "Jordan Smith",
    email: "jordan.smith@gmail.com"
  },
  jobDetails: {
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced Frontend Developer proficient in React and modern JavaScript to join our growing team. The ideal candidate will have experience building responsive web applications and working in an agile environment.",
    requiredSkills: ["JavaScript", "React", "TypeScript", "CSS/SASS", "Redux", "Testing"]
  },
  codingTest: {
    timeLimit: 45,
    difficulty: "medium",
    passingScore: 75,
    problem: "Implement a throttle function that limits the number of times a function can be called in a given time period."
  }
};

const InterviewDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasReport, setHasReport] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to load from localStorage for faster display
        // Then fetch fresh data from API
        
        // This part would be adjusted for a real implementation
        // For now we'll use mock data
        setInterview(mockInterviewData);
        
        // We would fetch actual data from the API in production
        // const response = await axios.get(`http://localhost:5001/api/interviews/${id}`);
        // setInterview(response.data);
        
        // Check if report exists
        try {
          // Simulating API call to check if report exists
          setHasReport(true);
          // In production:
          // const reportResponse = await axios.get(`http://localhost:5001/api/interviews/${id}/report`);
          // setHasReport(true);
        } catch (reportErr) {
          // No report yet
          setHasReport(false);
        }
        
        // Check if payment exists (for companies)
        if (user?.role === 'company') {
          try {
            // Simulating API call to check if payment exists
            setHasPaid(false); // Set to false to show payment button
            // In production:
            // const paymentResponse = await axios.get(`http://localhost:5001/api/payments`);
            // const interviewPayment = paymentResponse.data.find(
            //  payment => payment.interview === id && payment.status === 'paid'
            // );
            // setHasPaid(!!interviewPayment);
          } catch (paymentErr) {
            // No payment info
            setHasPaid(false);
          }
        }

        // Calculate time remaining until interview
        const interviewDate = new Date(mockInterviewData.schedule.date);
        const [hours, minutes] = mockInterviewData.schedule.startTime.split(':');
        interviewDate.setHours(parseInt(hours), parseInt(minutes.replace(' AM', '').replace(' PM', '')));
        if (mockInterviewData.schedule.startTime.includes('PM') && hours !== '12') {
          interviewDate.setHours(interviewDate.getHours() + 12);
        }
        
        const now = new Date();
        const timeDiff = Math.max(0, interviewDate - now);
        
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeRemaining({
            days,
            hours,
            minutes,
            isToday: days === 0
          });
        } else {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            isToday: true,
            isPast: true
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError("Failed to load interview details");
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, user]);

  const handleJoinInterview = () => {
    navigate(`/interview/${interview._id}/setup`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!interview) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Interview not found.</Alert>
      </Container>
    );
  }

  const isCompany = user?.role === 'company';
  const isInterviewer = user?.role === 'interviewer';
  const canJoin = interview.status === 'accepted';
  const interviewDate = new Date(interview.schedule.date);
  const isToday = new Date().toDateString() === interviewDate.toDateString();
  const isPast = interviewDate < new Date();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Join Interview Call to Action */}
      {canJoin && timeRemaining?.isToday && !timeRemaining?.isPast && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Your interview is scheduled for today!
              </Typography>
              <Typography variant="body1">
                Join the video call and coding interface to conduct the technical interview with {interview.candidate.name}.
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">
                    Starting in: {timeRemaining.hours} hours and {timeRemaining.minutes} minutes
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                startIcon={<VideocamIcon />}
                endIcon={<CodeIcon />}
                onClick={handleJoinInterview}
                sx={{ 
                  py: 1.5,
                  px: 3,
                  fontSize: '1.1rem',
                  boxShadow: 3,
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 5,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Join Video & Code Interface
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Interview Details
        </Typography>
        <Chip 
          label={interview.status.toUpperCase()} 
          color={
            interview.status === 'completed' ? 'success' : 
            interview.status === 'accepted' ? 'primary' :
            interview.status === 'pending' ? 'warning' : 'error'
          }
          sx={{ mb: 2 }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Schedule Information
                </Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Date" 
                    secondary={format(new Date(interview.schedule.date), 'MMMM dd, yyyy')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Time" 
                    secondary={`${interview.schedule.startTime} (${interview.schedule.duration} minutes)`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Room ID" 
                    secondary={interview.roomId} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                {isCompany ? 'Interviewer Information' : 'Company Information'}
              </Typography>
              <List dense>
                {isCompany && (
                  <>
                    <ListItem>
                      <ListItemText 
                        primary="Name" 
                        secondary={interview.interviewer.name} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Skills" 
                        secondary={interview.interviewer.skills?.join(', ')} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Rating" 
                        secondary={`${interview.interviewer.rating}/5`} 
                      />
                    </ListItem>
                  </>
                )}
                {isInterviewer && (
                  <>
                    <ListItem>
                      <ListItemText 
                        primary="Company" 
                        secondary={interview.company.companyName} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Industry" 
                        secondary={interview.company.industry} 
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Candidate Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ListItem>
                  <ListItemText 
                    primary="Name" 
                    secondary={interview.candidate.name} 
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItem>
                  <ListItemText 
                    primary="Email" 
                    secondary={interview.candidate.email} 
                  />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {interview.jobDetails.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {interview.jobDetails.description}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Required Skills:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {interview.jobDetails.requiredSkills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  sx={{ mr: 1, mb: 1 }} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1 }} />
              Coding Test Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ListItem>
                  <ListItemText 
                    primary="Time Limit" 
                    secondary={`${interview.codingTest.timeLimit} minutes`} 
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} md={4}>
                <ListItem>
                  <ListItemText 
                    primary="Difficulty" 
                    secondary={interview.codingTest.difficulty.charAt(0).toUpperCase() + 
                              interview.codingTest.difficulty.slice(1)} 
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} md={4}>
                <ListItem>
                  <ListItemText 
                    primary="Passing Score" 
                    secondary={`${interview.codingTest.passingScore}%`} 
                  />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          {canJoin && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<VideocamIcon />}
              endIcon={<CodeIcon />}
              onClick={handleJoinInterview}
              sx={{ 
                mr: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              Join Video & Code Interface
            </Button>
          )}
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default InterviewDetails;
