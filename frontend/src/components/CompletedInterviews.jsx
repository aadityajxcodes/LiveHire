import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompletedInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompletedInterviews();
  }, []);

  const fetchCompletedInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5001/api/interviews/completed',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterviews(response.data);
    } catch (err) {
      console.error('Error fetching completed interviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return '#4caf50';
    if (score >= 7) return '#8bc34a';
    if (score >= 5) return '#ffc107';
    if (score >= 3) return '#ff9800';
    return '#f44336';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strong_hire': return '#4caf50';
      case 'hire': return '#8bc34a';
      case 'consider': return '#ffc107';
      case 'reject': return '#f44336';
      default: return '#757575';
    }
  };

  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'strong_hire': return 'Strong Hire';
      case 'hire': return 'Hire';
      case 'consider': return 'Consider';
      case 'reject': return 'Reject';
      default: return 'No Recommendation';
    }
  };

  const handleViewReport = (interviewId) => {
    navigate(`/interview-report/${interviewId}`);
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
      <Typography variant="h5" gutterBottom sx={{ color: '#0057b7', fontWeight: 'bold', mb: 3 }}>
        Completed Interviews
      </Typography>

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

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ color: '#666', mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(interview.schedule.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  {interview.jobDetails.title}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${interview.evaluation.overallScore}/10`}
                    sx={{
                      backgroundColor: getScoreColor(interview.evaluation.overallScore),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={getRecommendationText(interview.evaluation.recommendation)}
                    sx={{
                      backgroundColor: getRecommendationColor(interview.evaluation.recommendation),
                      color: 'white'
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Technical Skills
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(interview.evaluation.technicalSkills).map(([skill, score]) => (
                      <Grid item xs={6} key={skill}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: getScoreColor(score), fontSize: '1rem' }} />
                          <Typography variant="body2">
                            {skill.split(/(?=[A-Z])/).join(' ')}: {score}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleViewReport(interview._id)}
                    sx={{
                      backgroundColor: '#0057b7',
                      '&:hover': { backgroundColor: '#004494' }
                    }}
                  >
                    View Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {interviews.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No completed interviews yet
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CompletedInterviews; 