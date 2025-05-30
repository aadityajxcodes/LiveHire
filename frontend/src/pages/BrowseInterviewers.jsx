import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './BrowseInterviewers.css';

const BrowseInterviewers = () => {
  const navigate = useNavigate();
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    skills: [],
    experience: '',
    rating: 0,
    search: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInterviewers();
  }, [filters, page]);

  const fetchInterviewers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/interviewers', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
          page,
          limit: 9,
        },
      });
      setInterviewers(response.data.interviewers);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviewers');
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPage(1);
  };

  const handleViewProfile = (interviewerId) => {
    navigate(`/interviewer-profile/${interviewerId}`);
  };

  const handleScheduleInterview = (interviewerId) => {
    navigate(`/schedule-interview/${interviewerId}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="browse-interviewers-container">
      <Typography variant="h4" component="h1" className="page-title">
        Browse Interviewers
      </Typography>

      <Paper className="filters-section">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="Java">Java</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="SQL">SQL</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Experience</InputLabel>
              <Select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="1-3">1-3 years</MenuItem>
                <MenuItem value="3-5">3-5 years</MenuItem>
                <MenuItem value="5+">5+ years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography component="legend">Minimum Rating</Typography>
              <Rating
                value={filters.rating}
                onChange={(_, value) => handleFilterChange('rating', value)}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} className="interviewers-grid">
        {interviewers.map((interviewer) => (
          <Grid item xs={12} sm={6} md={4} key={interviewer._id}>
            <Card className="interviewer-card">
              <CardContent>
                <Box className="interviewer-header">
                  <Typography variant="h6" component="div">
                    {interviewer.name}
                  </Typography>
                  <Rating
                    value={interviewer.rating}
                    readOnly
                    precision={0.5}
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  <WorkIcon fontSize="small" /> {interviewer.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  <LocationIcon fontSize="small" /> {interviewer.location}
                </Typography>
                <Box className="skills-section">
                  {interviewer.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      className="skill-chip"
                    />
                  ))}
                </Box>
                <Typography variant="body2" className="bio">
                  {interviewer.bio}
                </Typography>
                <Box className="stats-section">
                  <Typography variant="body2">
                    <StarIcon fontSize="small" /> {interviewer.totalInterviews} interviews
                  </Typography>
                  <Typography variant="body2">
                    {interviewer.successRate}% success rate
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleViewProfile(interviewer._id)}
                >
                  View Profile
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleScheduleInterview(interviewer._id)}
                >
                  Schedule Interview
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default BrowseInterviewers;
