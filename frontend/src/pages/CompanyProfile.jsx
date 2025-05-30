import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const [company, setCompany] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    linkedin: '',
    email: '',
    phone: '',
    description: '',
    techStack: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/companies/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompany(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch company profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechStackChange = (e) => {
    const value = e.target.value;
    setCompany(prev => ({
      ...prev,
      techStack: value.split(',').map(item => item.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5001/api/companies/profile',
        company,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box className="company-profile-container">
      <Paper className="profile-paper">
        <Box className="profile-header">
          <Avatar
            src={company.logo}
            alt={company.name}
            className="company-logo"
          >
            <BusinessIcon />
          </Avatar>
          <Typography variant="h4" component="h1">
            {company.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        {success && (
          <Alert severity="success" className="alert">
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company Name"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Industry"
                name="industry"
                value={company.industry}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company Size"
                name="size"
                value={company.size}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                value={company.location}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!editMode}
                InputProps={{
                  startAdornment: <LocationIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Website"
                name="website"
                value={company.website}
                onChange={handleInputChange}
                fullWidth
                disabled={!editMode}
                InputProps={{
                  startAdornment: <WebIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="LinkedIn"
                name="linkedin"
                value={company.linkedin}
                onChange={handleInputChange}
                fullWidth
                disabled={!editMode}
                InputProps={{
                  startAdornment: <LinkedInIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={company.email}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!editMode}
                InputProps={{
                  startAdornment: <EmailIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                name="phone"
                value={company.phone}
                onChange={handleInputChange}
                fullWidth
                disabled={!editMode}
                InputProps={{
                  startAdornment: <PhoneIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={company.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tech Stack (comma separated)"
                name="techStack"
                value={company.techStack.join(', ')}
                onChange={handleTechStackChange}
                fullWidth
                disabled={!editMode}
                helperText="Enter technologies separated by commas"
              />
              <Box className="tech-stack-chips">
                {company.techStack.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    className="tech-chip"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {editMode && (
            <Box className="form-actions">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Save Changes
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyProfile;
