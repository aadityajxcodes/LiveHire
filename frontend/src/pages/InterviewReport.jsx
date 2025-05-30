import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Rating,
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CodeIcon from '@mui/icons-material/Code';
import axios from 'axios';
import jsPDF from 'jspdf';
import './InterviewReport.css';

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockReport = {
    _id: 'report123',
    interviewId: id,
    candidate: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      avatar: 'https://via.placeholder.com/120?text=AJ'
    },
    position: 'Senior Frontend Developer',
    company: 'TechInnovate Solutions',
    date: new Date().toISOString(),
    scores: {
      technical: 4.5,
      communication: 4.0,
      coding: 4.2,
      overall: 4.2
    },
    skillAssessments: [
      { skill: 'JavaScript', rating: 5, comment: 'Excellent knowledge of ES6+ features' },
      { skill: 'React', rating: 4, comment: 'Strong understanding of React hooks and state management' },
      { skill: 'CSS/SASS', rating: 4, comment: 'Good knowledge of modern CSS and responsive design' },
      { skill: 'System Design', rating: 4, comment: 'Demonstrated solid approach to component architecture' },
      { skill: 'Problem Solving', rating: 4, comment: 'Methodical and efficient approach to solving problems' }
    ],
    feedback: 'Alex demonstrated strong technical skills and problem-solving abilities. He communicated clearly throughout the interview and showed a deep understanding of modern JavaScript and React concepts. His approach to the coding exercise was well-structured and efficient. The candidate would be a valuable addition to the team.',
    codeSample: `
function findMaximum(arr) {
  if (!arr || arr.length === 0) {
    return null;
  }
  
  return Math.max(...arr);
}

// Test cases
console.log(findMaximum([1, 3, 5, 7, 9])); // Expected: 9
console.log(findMaximum([-5, -3, -1]));    // Expected: -1
    `,
    recommendation: 'hire',
    interviewer: {
      name: 'Sarah Williams',
      position: 'Technical Lead',
      email: 'sarah.williams@techinnovate.com'
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5001/api/interviews/${id}/report`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.response?.data?.message || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

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

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Technical Interview Report', 20, 20);
    
    // Candidate Info
    doc.setFontSize(14);
    doc.text(`Candidate: ${report.candidate.name}`, 20, 40);
    doc.text(`Position: ${report.jobDetails.title}`, 20, 50);
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 60);
    
    // Overall Score
    doc.text(`Overall Score: ${report.evaluation.overallScore}/10`, 20, 80);
    doc.text(`Recommendation: ${getRecommendationText(report.evaluation.recommendation)}`, 20, 90);
    
    // Technical Skills
    doc.text('Technical Skills:', 20, 110);
    let y = 120;
    Object.entries(report.evaluation.technicalSkills).forEach(([skill, score]) => {
      doc.text(`${skill.split(/(?=[A-Z])/).join(' ')}: ${score}/10`, 30, y);
      y += 10;
    });
    
    // Soft Skills
    doc.text('Soft Skills:', 20, y + 10);
    y += 20;
    Object.entries(report.evaluation.softSkills).forEach(([skill, score]) => {
      doc.text(`${skill.split(/(?=[A-Z])/).join(' ')}: ${score}/10`, 30, y);
      y += 10;
    });
    
    // Summary
    doc.text('Summary:', 20, y + 10);
    const splitSummary = doc.splitTextToSize(report.evaluation.summary, 170);
    doc.text(splitSummary, 20, y + 20);
    
    // Save the PDF
    doc.save(`interview-report-${report.candidate.name.replace(/\s+/g, '-')}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h4" sx={{ color: '#0057b7', fontWeight: 'bold' }}>
            Technical Interview Report
          </Typography>
          <IconButton 
            onClick={downloadReport}
            sx={{ 
              backgroundColor: '#0057b7',
              color: 'white',
              '&:hover': { backgroundColor: '#004494' }
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>

        {/* Candidate Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Candidate Information</Typography>
                <Typography><strong>Name:</strong> {report.candidate.name}</Typography>
                <Typography><strong>Position:</strong> {report.jobDetails.title}</Typography>
                <Typography>
                  <strong>Interview Date:</strong> {new Date(report.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Overall Assessment</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography><strong>Score:</strong></Typography>
                  <Chip 
                    label={`${report.evaluation.overallScore}/10`}
                    sx={{ 
                      backgroundColor: getScoreColor(report.evaluation.overallScore),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography><strong>Recommendation:</strong></Typography>
                  <Chip 
                    label={getRecommendationText(report.evaluation.recommendation)}
                    sx={{ 
                      backgroundColor: getRecommendationColor(report.evaluation.recommendation),
                      color: 'white'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Technical Skills */}
        <Typography variant="h5" sx={{ mb: 2, color: '#0057b7' }}>Technical Skills Assessment</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(report.evaluation.technicalSkills).map(([skill, score]) => (
            <Grid item xs={12} sm={6} md={4} key={skill}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {skill.split(/(?=[A-Z])/).join(' ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ color: getScoreColor(score) }}>
                      {score}
                    </Typography>
                    <Typography color="text.secondary">/10</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Soft Skills */}
        <Typography variant="h5" sx={{ mb: 2, color: '#0057b7' }}>Soft Skills Assessment</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(report.evaluation.softSkills).map(([skill, score]) => (
            <Grid item xs={12} sm={6} md={4} key={skill}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {skill.split(/(?=[A-Z])/).join(' ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ color: getScoreColor(score) }}>
                      {score}
                    </Typography>
                    <Typography color="text.secondary">/10</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Coding Test */}
        <Typography variant="h5" sx={{ mb: 2, color: '#0057b7' }}>Coding Test Evaluation</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(report.evaluation.codingTest).map(([aspect, score]) => (
            <Grid item xs={12} sm={6} md={4} key={aspect}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {aspect.split(/(?=[A-Z])/).join(' ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ color: getScoreColor(score) }}>
                      {score}
                    </Typography>
                    <Typography color="text.secondary">/10</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Summary */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#0057b7' }}>
              Interview Summary
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {report.evaluation.summary}
            </Typography>
          </CardContent>
        </Card>

        {/* Strengths & Areas for Improvement */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
                  Strengths
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {report.evaluation.strengths.map((strength, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {strength}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#f44336' }}>
                  Areas for Improvement
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {report.evaluation.areasForImprovement.map((area, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {area}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Code Samples */}
        {report.evaluation.codeSamples.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: '#0057b7' }}>
              Code Samples
            </Typography>
            <Grid container spacing={3}>
              {report.evaluation.codeSamples.map((sample, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CodeIcon sx={{ color: '#0057b7' }} />
                        <Typography variant="h6">Sample #{index + 1}</Typography>
                      </Box>
                      <Box
                        component="pre"
                        sx={{
                          p: 2,
                          backgroundColor: '#f5f5f5',
                          borderRadius: 1,
                          overflow: 'auto'
                        }}
                      >
                        <code>{sample.code}</code>
                      </Box>
                      {sample.explanation && (
                        <Typography sx={{ mt: 2, color: '#666' }}>
                          {sample.explanation}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default InterviewReport; 