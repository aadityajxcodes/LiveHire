import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Rating,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './InterviewerProfile.css';

const InterviewerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interviewer, setInterviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchInterviewerDetails();
    fetchReviews();
  }, [id]);

  const fetchInterviewerDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/interviewers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviewer(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviewer details');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/reviews/interviewer/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleScheduleInterview = () => {
    navigate(`/schedule-interview/${id}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!interviewer) return <Typography>Interviewer not found</Typography>;

  return (
    <Box className="interviewer-profile-container">
      <Paper className="profile-header">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} className="avatar-section">
            <Avatar
              src={interviewer.avatar}
              alt={interviewer.name}
              className="profile-avatar"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleScheduleInterview}
              className="schedule-button"
            >
              Schedule Interview
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box className="profile-info">
              <Typography variant="h4" component="h1">
                {interviewer.name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                <WorkIcon /> {interviewer.title}
              </Typography>
              <Typography color="text.secondary">
                <LocationIcon /> {interviewer.location}
              </Typography>
              <Box className="rating-section">
                <Rating value={interviewer.rating} readOnly precision={0.5} />
                <Typography>({interviewer.totalReviews} reviews)</Typography>
              </Box>
              <Box className="stats-grid">
                <Paper className="stat-card">
                  <Typography variant="h6">{interviewer.totalInterviews}</Typography>
                  <Typography>Total Interviews</Typography>
                </Paper>
                <Paper className="stat-card">
                  <Typography variant="h6">{interviewer.successRate}%</Typography>
                  <Typography>Success Rate</Typography>
                </Paper>
                <Paper className="stat-card">
                  <Typography variant="h6">{interviewer.experience}+</Typography>
                  <Typography>Years Experience</Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box className="profile-content">
        <Tabs value={tabValue} onChange={handleTabChange} className="profile-tabs">
          <Tab label="About" />
          <Tab label="Skills" />
          <Tab label="Reviews" />
          <Tab label="Availability" />
        </Tabs>

        <Box className="tab-content">
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography paragraph>{interviewer.bio}</Typography>
              <Divider />
              <Box className="contact-info">
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <EmailIcon /> {interviewer.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <PhoneIcon /> {interviewer.phone}
                    </Typography>
                  </Grid>
                  {interviewer.linkedin && (
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <LinkedInIcon /> {interviewer.linkedin}
                      </Typography>
                    </Grid>
                  )}
                  {interviewer.github && (
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <GitHubIcon /> {interviewer.github}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Technical Skills
              </Typography>
              <Box className="skills-grid">
                {interviewer.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    className="skill-chip"
                  />
                ))}
              </Box>
              <Typography variant="h6" gutterBottom className="section-title">
                Areas of Expertise
              </Typography>
              <Typography paragraph>{interviewer.expertise}</Typography>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recent Reviews
              </Typography>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review._id} className="review-card">
                    <CardContent>
                      <Box className="review-header">
                        <Typography variant="subtitle1">
                          {review.companyName}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography color="text.secondary" gutterBottom>
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                      <Typography paragraph>{review.comment}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No reviews yet</Typography>
              )}
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <Typography paragraph>
                {interviewer.availability || 'Please contact for availability'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewerProfile;
