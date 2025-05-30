import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Alert,
  Rating
} from '@mui/material';
import axios from 'axios';

const InterviewEvaluationForm = ({ interviewId, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Evaluation form state
  const [evaluation, setEvaluation] = useState({
    technicalSkills: {
      algorithmicThinking: 5,
      problemSolving: 5,
      codeQuality: 5,
      debugging: 5,
      systemDesign: 5,
      dataStructures: 5
    },
    softSkills: {
      communication: 5,
      problemApproach: 5,
      teamworkPotential: 5
    },
    codingTest: {
      timeComplexity: 5,
      spaceComplexity: 5,
      edgeCases: 5
    },
    summary: '',
    recommendation: 'consider',
    strengths: '',
    areasForImprovement: '',
    codeSamples: [{
      code: '',
      explanation: ''
    }]
  });

  // Handle slider changes
  const handleSkillChange = (category, skillName, value) => {
    setEvaluation(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skillName]: value
      }
    }));
  };

  // Handle text changes
  const handleTextChange = (e) => {
    setEvaluation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Add code sample
  const addCodeSample = () => {
    setEvaluation(prev => ({
      ...prev,
      codeSamples: [...prev.codeSamples, { code: '', explanation: '' }]
    }));
  };

  // Update code sample
  const updateCodeSample = (index, field, value) => {
    const newCodeSamples = [...evaluation.codeSamples];
    newCodeSamples[index][field] = value;
    setEvaluation(prev => ({
      ...prev,
      codeSamples: newCodeSamples
    }));
  };

  // Remove code sample
  const removeCodeSample = (index) => {
    setEvaluation(prev => ({
      ...prev,
      codeSamples: prev.codeSamples.filter((_, i) => i !== index)
    }));
  };

  // Calculate overall rating
  const calculateOverallRating = () => {
    const technicalAvg = Object.values(evaluation.technicalSkills).reduce((a, b) => a + b, 0) / 6;
    const softSkillsAvg = Object.values(evaluation.softSkills).reduce((a, b) => a + b, 0) / 3;
    const codingTestAvg = Object.values(evaluation.codingTest).reduce((a, b) => a + b, 0) / 3;
    
    return ((technicalAvg * 0.5) + (softSkillsAvg * 0.3) + (codingTestAvg * 0.2)).toFixed(1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formattedEvaluation = {
        ...evaluation,
        strengths: evaluation.strengths.split('\n').filter(item => item.trim() !== ''),
        areasForImprovement: evaluation.areasForImprovement.split('\n').filter(item => item.trim() !== ''),
        codeSamples: evaluation.codeSamples.filter(sample => sample.code.trim() !== '')
      };
      
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/interviews/${interviewId}/evaluation`,
        { evaluation: formattedEvaluation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      
      // Generate report
      const reportResponse = await axios.get(
        `http://localhost:5001/api/interviews/${interviewId}/report`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (onSuccess) {
        onSuccess(reportResponse.data);
      }
      
      // Redirect to report page
      setTimeout(() => {
        navigate(`/interview-report/${interviewId}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting evaluation:', err);
      setError(err.response?.data?.message || 'Failed to submit evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get recommendation text
  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'strong_hire': return 'Strong Hire';
      case 'hire': return 'Hire';
      case 'consider': return 'Consider';
      case 'reject': return 'Reject';
      default: return 'No Recommendation';
    }
  };

  // Get color for recommendation chip
  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strong_hire': return 'success';
      case 'hire': return 'primary';
      case 'consider': return 'warning';
      case 'reject': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#0057b7', fontWeight: 'bold', mb: 2 }}>
        Technical Interview Evaluation Form
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Evaluation submitted successfully! Generating report...
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Technical Skills Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0057b7' }}>
            Technical Skills Assessment
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(evaluation.technicalSkills).map(([skill, value]) => (
              <Grid item xs={12} md={6} key={skill}>
                <Typography gutterBottom>
                  {skill.split(/(?=[A-Z])/).join(' ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={value}
                    onChange={(_, newValue) => handleSkillChange('technicalSkills', skill, newValue)}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    sx={{ color: '#0057b7' }}
                  />
                  <Typography sx={{ minWidth: 30 }}>{value}/10</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Soft Skills Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0057b7' }}>
            Soft Skills Assessment
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(evaluation.softSkills).map(([skill, value]) => (
              <Grid item xs={12} md={4} key={skill}>
                <Typography gutterBottom>
                  {skill.split(/(?=[A-Z])/).join(' ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={value}
                    onChange={(_, newValue) => handleSkillChange('softSkills', skill, newValue)}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    sx={{ color: '#0057b7' }}
                  />
                  <Typography sx={{ minWidth: 30 }}>{value}/10</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Coding Test Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0057b7' }}>
            Coding Test Evaluation
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(evaluation.codingTest).map(([aspect, value]) => (
              <Grid item xs={12} md={4} key={aspect}>
                <Typography gutterBottom>
                  {aspect.split(/(?=[A-Z])/).join(' ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={value}
                    onChange={(_, newValue) => handleSkillChange('codingTest', aspect, newValue)}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    sx={{ color: '#0057b7' }}
                  />
                  <Typography sx={{ minWidth: 30 }}>{value}/10</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Overall Rating */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Overall Rating</Typography>
          <Chip 
            label={`${calculateOverallRating()}/10`}
            color="primary"
            sx={{ 
              fontSize: '1.2rem', 
              padding: '20px', 
              fontWeight: 'bold',
              height: 'auto',
              backgroundColor: '#0057b7'
            }}
          />
        </Box>
        
        {/* Summary & Recommendation */}
        <Box sx={{ mb: 4 }}>
          <TextField
            name="summary"
            label="Interview Summary"
            value={evaluation.summary}
            onChange={handleTextChange}
            multiline
            rows={4}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth>
            <InputLabel id="recommendation-label">Final Recommendation</InputLabel>
            <Select
              labelId="recommendation-label"
              name="recommendation"
              value={evaluation.recommendation}
              onChange={handleTextChange}
              label="Final Recommendation"
              required
            >
              <MenuItem value="strong_hire">Strong Hire</MenuItem>
              <MenuItem value="hire">Hire</MenuItem>
              <MenuItem value="consider">Consider</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Strengths & Areas for Improvement */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="strengths"
              label="Candidate Strengths (one per line)"
              value={evaluation.strengths}
              onChange={handleTextChange}
              multiline
              rows={4}
              fullWidth
              required
              placeholder="● Strong algorithmic thinking
● Excellent code quality
● Good system design approach"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="areasForImprovement"
              label="Areas for Improvement (one per line)"
              value={evaluation.areasForImprovement}
              onChange={handleTextChange}
              multiline
              rows={4}
              fullWidth
              required
              placeholder="● Could improve time complexity
● Edge case handling needs work
● Should focus on code readability"
            />
          </Grid>
        </Grid>
        
        {/* Code Samples */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#0057b7' }}>
            Code Samples
            <Button
              onClick={addCodeSample}
              variant="outlined"
              size="small"
              sx={{ ml: 2 }}
            >
              Add Sample
            </Button>
          </Typography>
          
          {evaluation.codeSamples.map((sample, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">Sample #{index + 1}</Typography>
                {index > 0 && (
                  <Button
                    onClick={() => removeCodeSample(index)}
                    color="error"
                    size="small"
                  >
                    Remove
                  </Button>
                )}
              </Box>
              
              <TextField
                value={sample.code}
                onChange={(e) => updateCodeSample(index, 'code', e.target.value)}
                multiline
                rows={4}
                fullWidth
                label="Code"
                sx={{ mb: 2 }}
              />
              
              <TextField
                value={sample.explanation}
                onChange={(e) => updateCodeSample(index, 'explanation', e.target.value)}
                multiline
                rows={2}
                fullWidth
                label="Explanation"
              />
            </Box>
          ))}
        </Box>
        
        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || success}
            sx={{ 
              minWidth: 200,
              backgroundColor: '#0057b7',
              '&:hover': { backgroundColor: '#004494' }
            }}
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default InterviewEvaluationForm; 