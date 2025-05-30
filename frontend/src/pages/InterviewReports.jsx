import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Grid,
  TextField,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './InterviewReports.css';

const InterviewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reports');
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5001/api/reports/${reportId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview-report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const handleShareReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/reports/${reportId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Show success message or handle sharing UI
    } catch (err) {
      setError('Failed to share report');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredReports = reports.filter(report =>
    report.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="interview-reports-container">
      <Box className="reports-header">
        <Typography variant="h4" component="h1">
          Interview Reports
        </Typography>
        <TextField
          label="Search Reports"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
        />
      </Box>

      <TableContainer component={Paper} className="reports-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Interviewer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Overall Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report.candidateName}</TableCell>
                <TableCell>{report.position}</TableCell>
                <TableCell>{report.interviewerName}</TableCell>
                <TableCell>
                  {new Date(report.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    color={getStatusColor(report.status)}
                  />
                </TableCell>
                <TableCell>
                  <Rating value={report.overallRating} readOnly precision={0.5} />
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewReport(report)}
                  >
                    View
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadReport(report._id)}
                  >
                    Download
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    onClick={() => handleShareReport(report._id)}
                  >
                    Share
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Interview Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box className="report-details">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Candidate Information</Typography>
                  <Typography>Name: {selectedReport.candidateName}</Typography>
                  <Typography>Position: {selectedReport.position}</Typography>
                  <Typography>
                    Date: {new Date(selectedReport.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Interviewer Information</Typography>
                  <Typography>Name: {selectedReport.interviewerName}</Typography>
                  <Typography>Email: {selectedReport.interviewerEmail}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Technical Assessment</Typography>
                  <Box className="rating-section">
                    <Typography>Problem Solving:</Typography>
                    <Rating value={selectedReport.technicalSkills.problemSolving} readOnly />
                  </Box>
                  <Box className="rating-section">
                    <Typography>Coding Skills:</Typography>
                    <Rating value={selectedReport.technicalSkills.coding} readOnly />
                  </Box>
                  <Box className="rating-section">
                    <Typography>System Design:</Typography>
                    <Rating value={selectedReport.technicalSkills.systemDesign} readOnly />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Soft Skills</Typography>
                  <Box className="rating-section">
                    <Typography>Communication:</Typography>
                    <Rating value={selectedReport.softSkills.communication} readOnly />
                  </Box>
                  <Box className="rating-section">
                    <Typography>Teamwork:</Typography>
                    <Rating value={selectedReport.softSkills.teamwork} readOnly />
                  </Box>
                  <Box className="rating-section">
                    <Typography>Problem-Solving Approach:</Typography>
                    <Rating value={selectedReport.softSkills.problemSolving} readOnly />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Overall Assessment</Typography>
                  <Typography>{selectedReport.summary}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Recommendation</Typography>
                  <Typography>{selectedReport.recommendation}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => handleDownloadReport(selectedReport?._id)}
          >
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewReports;
