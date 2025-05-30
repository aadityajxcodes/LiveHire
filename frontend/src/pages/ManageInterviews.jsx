import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './ManageInterviews.css';

const ManageInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/interviews/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviews');
      setLoading(false);
    }
  };

  const handleViewDetails = (interview) => {
    navigate(`/interview-details/${interview._id}`);
  };

  const handleEdit = (interview) => {
    setSelectedInterview(interview);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (interviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/interviews/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInterviews();
    } catch (err) {
      setError('Failed to delete interview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(
          `http://localhost:5001/api/interviews/${selectedInterview._id}`,
          selectedInterview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5001/api/interviews',
          selectedInterview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setOpenDialog(false);
      fetchInterviews();
    } catch (err) {
      setError('Failed to save interview');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="manage-interviews-container">
      <Box className="manage-interviews-header">
        <Typography variant="h4" component="h1">
          Manage Interviews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ScheduleIcon />}
          onClick={() => {
            setSelectedInterview(null);
            setEditMode(false);
            setOpenDialog(true);
          }}
        >
          Schedule New Interview
        </Button>
      </Box>

      <TableContainer component={Paper} className="interviews-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Interviewer</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interviews.map((interview) => (
              <TableRow key={interview._id}>
                <TableCell>{interview.candidateName}</TableCell>
                <TableCell>{interview.position}</TableCell>
                <TableCell>{interview.interviewerName}</TableCell>
                <TableCell>
                  {new Date(interview.dateTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={interview.status}
                    color={getStatusColor(interview.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(interview)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(interview)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(interview._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Interview' : 'Schedule New Interview'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} className="interview-form">
            <TextField
              label="Candidate Name"
              value={selectedInterview?.candidateName || ''}
              onChange={(e) => setSelectedInterview({
                ...selectedInterview,
                candidateName: e.target.value
              })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Position"
              value={selectedInterview?.position || ''}
              onChange={(e) => setSelectedInterview({
                ...selectedInterview,
                position: e.target.value
              })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date and Time"
              type="datetime-local"
              value={selectedInterview?.dateTime || ''}
              onChange={(e) => setSelectedInterview({
                ...selectedInterview,
                dateTime: e.target.value
              })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={selectedInterview?.type || ''}
                onChange={(e) => setSelectedInterview({
                  ...selectedInterview,
                  type: e.target.value
                })}
                label="Interview Type"
                required
              >
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="behavioral">Behavioral</MenuItem>
                <MenuItem value="coding">Coding</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={selectedInterview?.duration || 60}
              onChange={(e) => setSelectedInterview({
                ...selectedInterview,
                duration: e.target.value
              })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Notes"
              multiline
              rows={4}
              value={selectedInterview?.notes || ''}
              onChange={(e) => setSelectedInterview({
                ...selectedInterview,
                notes: e.target.value
              })}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInterviews;
