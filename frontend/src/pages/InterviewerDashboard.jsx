import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

const InterviewerDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([
    { startTime: '09:00', endTime: '10:00', available: false },
    { startTime: '10:00', endTime: '11:00', available: false },
    { startTime: '11:00', endTime: '12:00', available: false },
    { startTime: '13:00', endTime: '14:00', available: false },
    { startTime: '14:00', endTime: '15:00', available: false },
    { startTime: '15:00', endTime: '16:00', available: false },
    { startTime: '16:00', endTime: '17:00', available: false },
  ]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Helper function to format a date nicely
  const formatDate = (dateString) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      // Check if using demo account
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email === 'demo@interviewer.com') {
        // Use mock data for demo account
        const mockData = getMockInterviews();
        setInterviews(mockData);
        setLoading(false);
        return;
      }
      
      // Regular API call for non-demo accounts
      const response = await axios.get('http://localhost:5001/api/interviews/my-interviews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.data && Array.isArray(response.data)) {
        setInterviews(response.data);
      } else {
        // Fallback to mock data if response format is unexpected
        setInterviews(getMockInterviews());
        setSnackbar({
          open: true,
          message: 'Using demo data due to API response format',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // If error, still show mock data for better UX
      setInterviews(getMockInterviews());
      setSnackbar({
        open: true,
        message: 'Could not connect to server. Using demo data.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock interview data for demo
  const getMockInterviews = () => {
    // Create dates for demo purposes
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      {
        _id: 'mock-interview-1',
        company: {
          companyName: 'TechInnovate Solutions',
        },
        candidate: {
          name: 'Alex Johnson'
        },
        schedule: {
          date: today.toISOString(),
          startTime: '11:00 AM',
          duration: 60
        },
        jobDetails: {
          title: 'Senior Frontend Developer'
        },
        status: 'accepted'
      },
      {
        _id: 'mock-interview-2',
        company: {
          companyName: 'DataSys Inc.'
        },
        candidate: {
          name: 'Emily Chen'
        },
        schedule: {
          date: today.toISOString(),
          startTime: '3:00 PM',
          duration: 60
        },
        jobDetails: {
          title: 'Data Engineer'
        },
        status: 'pending'
      },
      {
        _id: 'mock-interview-3',
        company: {
          companyName: 'Cloud Solutions Co.'
        },
        candidate: {
          name: 'Michael Smith'
        },
        schedule: {
          date: tomorrow.toISOString(),
          startTime: '10:30 AM',
          duration: 60
        },
        jobDetails: {
          title: 'DevOps Engineer'
        },
        status: 'accepted'
      },
      {
        _id: 'mock-interview-4',
        company: {
          companyName: 'WebApp Studios'
        },
        candidate: {
          name: 'Sarah Williams'
        },
        schedule: {
          date: nextWeek.toISOString(),
          startTime: '2:00 PM',
          duration: 90
        },
        jobDetails: {
          title: 'Full Stack Developer'
        },
        status: 'pending'
      }
    ];
  };

  const handleStatusUpdate = async (interviewId, newStatus) => {
    // Check if using demo account
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === 'demo@interviewer.com') {
      // Update local state for demo
      setInterviews(
        interviews.map(interview => 
          interview._id === interviewId 
            ? { ...interview, status: newStatus } 
            : interview
        )
      );
      setSnackbar({
        open: true,
        message: `Interview ${newStatus} successfully`,
        severity: 'success'
      });
      return;
    }
    
    try {
      await axios.patch(
        `http://localhost:5001/api/interviews/${interviewId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchInterviews();
      setSnackbar({
        open: true,
        message: `Interview ${newStatus} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating interview status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update interview status',
        severity: 'error'
      });
    }
  };

  const handleViewDetails = (interviewId) => {
    navigate(`/interview-details/${interviewId}`);
  };

  const handleJoinInterview = (interviewId) => {
    // Navigate directly to the interview setup page
    navigate(`/interview/${interviewId}/setup`);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'info',
      completed: 'success',
      rejected: 'error',
      cancelled: 'default',
    };
    return colors[status] || 'default';
  };

  const isInterviewToday = (interviewDate) => {
    const today = new Date();
    const date = new Date(interviewDate);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // New function to handle availability dialog
  const handleOpenAvailabilityDialog = () => {
    setAvailabilityDialogOpen(true);
  };

  const handleCloseAvailabilityDialog = () => {
    setAvailabilityDialogOpen(false);
  };

  const handleTimeSlotToggle = (index) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index].available = !updatedTimeSlots[index].available;
    setTimeSlots(updatedTimeSlots);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSaveAvailability = async () => {
    const availableSlots = timeSlots
      .filter(slot => slot.available)
      .map(slot => ({
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
    
    // Demo account just shows success message
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === 'demo@interviewer.com') {
      setSnackbar({
        open: true,
        message: 'Availability updated successfully',
        severity: 'success'
      });
      handleCloseAvailabilityDialog();
      return;
    }
    
    try {
      // This would be the real API call for updating availability
      // await axios.post('http://localhost:5000/api/interviewers/availability', 
      //   { availableSlots },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     },
      //   }
      // );
      
      // For now, just simulate success
      setSnackbar({
        open: true,
        message: 'Availability updated successfully',
        severity: 'success'
      });
      handleCloseAvailabilityDialog();
    } catch (error) {
      console.error('Error updating availability:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update availability',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{ 
        p: { xs: 2, sm: 3 },
        minHeight: '100vh',
        boxSizing: 'border-box',
        backgroundColor: '#f5f7fa',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'linear-gradient(to right, #0057b7, #0077CC)',
                color: 'white',
                width: '100%'
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Welcome Back!
                </Typography>
                <Typography variant="body1">
                  Manage your upcoming interviews and review past sessions.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<AccessTimeIcon />}
                onClick={handleOpenAvailabilityDialog}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#0057b7',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                  }
                }}
              >
                Update Availability
              </Button>
            </Paper>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Pending Interviews
              </Typography>
              <Typography variant="h2" color="text.secondary">
                {interviews.filter(i => i.status === 'pending').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Accepted Interviews
              </Typography>
              <Typography variant="h2" color="text.secondary">
                {interviews.filter(i => i.status === 'accepted').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Completed Interviews
              </Typography>
              <Typography variant="h2" color="text.secondary">
                {interviews.filter(i => i.status === 'completed').length}
              </Typography>
            </Paper>
          </Grid>

          {/* Today's Interviews */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, color: '#0057b7', fontWeight: 'bold' }}>
                Today's Interviews
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Candidate</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Job Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {interviews
                      .filter(interview => isInterviewToday(interview.schedule.date))
                      .map((interview) => (
                        <TableRow key={interview._id} hover>
                          <TableCell>{interview.company?.companyName}</TableCell>
                          <TableCell>{interview.candidate.name}</TableCell>
                          <TableCell>{interview.schedule.startTime}</TableCell>
                          <TableCell>{interview.jobDetails.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={interview.status}
                              color={getStatusColor(interview.status)}
                              sx={{ fontWeight: 'medium' }}
                            />
                          </TableCell>
                          <TableCell>
                            {interview.status === 'accepted' && (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<VideocamIcon />}
                                onClick={() => handleJoinInterview(interview._id)}
                                sx={{ mr: 1 }}
                              >
                                Join Interview
                              </Button>
                            )}
                            {interview.status === 'pending' && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleStatusUpdate(interview._id, 'accepted')}
                                  sx={{ mr: 1 }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleStatusUpdate(interview._id, 'rejected')}
                                  sx={{ mr: 1 }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<InfoIcon />}
                              onClick={() => handleViewDetails(interview._id)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {interviews.filter(interview => isInterviewToday(interview.schedule.date)).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                            No interviews scheduled for today
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* All Interviews Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, color: '#0057b7', fontWeight: 'bold' }}>
                All Upcoming Interviews
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Candidate</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Job Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f7fa' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {interviews.map((interview) => (
                      <TableRow key={interview._id}>
                        <TableCell>{interview.company?.companyName}</TableCell>
                        <TableCell>{interview.candidate.name}</TableCell>
                        <TableCell>
                          {formatDate(interview.schedule.date)}
                          <br />
                          {interview.schedule.startTime}
                        </TableCell>
                        <TableCell>{interview.jobDetails.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={interview.status}
                            color={getStatusColor(interview.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {interview.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleStatusUpdate(interview._id, 'accepted')}
                                sx={{ mr: 1 }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleStatusUpdate(interview._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {interview.status === 'accepted' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<VideocamIcon />}
                                onClick={() => handleJoinInterview(interview._id)}
                                sx={{ fontSize: '0.8rem' }}
                              >
                                Join Video+Code
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<InfoIcon />}
                                onClick={() => handleViewDetails(interview._id)}
                              >
                                Details
                              </Button>
                            </Box>
                          )}
                          {interview.status !== 'pending' && interview.status !== 'accepted' && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<InfoIcon />}
                              onClick={() => handleViewDetails(interview._id)}
                            >
                              Details
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Availability Dialog */}
      <Dialog open={availabilityDialogOpen} onClose={handleCloseAvailabilityDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0057b7', color: 'white' }}>
          Update Your Availability
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Select Date
            </Typography>
            <TextField
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Available Time Slots
          </Typography>
          
          <Grid container spacing={2}>
            {timeSlots.map((slot, index) => (
              <Grid item xs={12} sm={6} key={`${slot.startTime}-${slot.endTime}`}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: slot.available ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    border: slot.available ? '1px solid #0057b7' : '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                  onClick={() => handleTimeSlotToggle(index)}
                >
                  <Typography>
                    {slot.startTime} - {slot.endTime}
                  </Typography>
                  <Chip 
                    label={slot.available ? "Available" : "Unavailable"} 
                    color={slot.available ? "primary" : "default"}
                    size="small"
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvailabilityDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveAvailability}
            variant="contained" 
            color="primary"
          >
            Save Availability
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InterviewerDashboard;