import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slider,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const EvaluationDialog = ({ open, onClose, onSubmit }) => {
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
    recommendation: 'hire'
  });

  const handleSliderChange = (category, skill) => (event, value) => {
    setEvaluation(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skill]: value
      }
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEvaluation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateOverallRating = () => {
    const allRatings = [
      ...Object.values(evaluation.technicalSkills),
      ...Object.values(evaluation.softSkills),
      ...Object.values(evaluation.codingTest)
    ];
    const average = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    return (average).toFixed(1);
  };

  const handleSubmit = () => {
    onSubmit({
      ...evaluation,
      overallRating: calculateOverallRating()
    });
  };

  const renderSliders = (category, skills) => (
    <Box sx={{ mb: 4 }}>
      {Object.entries(skills).map(([skill, value]) => (
        <Box key={skill} sx={{ mb: 2 }}>
          <Typography gutterBottom>
            {skill.replace(/([A-Z])/g, ' $1').trim()}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={value}
                onChange={handleSliderChange(category, skill)}
                min={0}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                {value}/10
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#0057b7', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Evaluate Interview - AADITYA JAISWAL
        <IconButton 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* Technical Skills */}
          <Typography variant="h6" gutterBottom sx={{ color: '#0057b7', mb: 2 }}>
            Technical Skills Assessment
          </Typography>
          {renderSliders('technicalSkills', evaluation.technicalSkills)}

          {/* Soft Skills */}
          <Typography variant="h6" gutterBottom sx={{ color: '#0057b7', mb: 2 }}>
            Soft Skills Assessment
          </Typography>
          {renderSliders('softSkills', evaluation.softSkills)}

          {/* Coding Test */}
          <Typography variant="h6" gutterBottom sx={{ color: '#0057b7', mb: 2 }}>
            Coding Test Evaluation
          </Typography>
          {renderSliders('codingTest', evaluation.codingTest)}

          {/* Overall Rating */}
          <Box sx={{ 
            my: 3, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" gutterBottom>
              Overall Rating
            </Typography>
            <Box sx={{ 
              bgcolor: '#0057b7',
              color: 'white',
              p: 2,
              borderRadius: 1,
              minWidth: 100,
              textAlign: 'center'
            }}>
              <Typography variant="h4">
                {calculateOverallRating()}/10
              </Typography>
            </Box>
          </Box>

          {/* Interview Summary */}
          <TextField
            name="summary"
            label="Interview Summary"
            multiline
            rows={4}
            value={evaluation.summary}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          {/* Final Recommendation */}
          <FormControl fullWidth>
            <InputLabel>Final Recommendation</InputLabel>
            <Select
              name="recommendation"
              value={evaluation.recommendation}
              onChange={handleInputChange}
              label="Final Recommendation"
            >
              <MenuItem value="strong_hire">Strong Hire</MenuItem>
              <MenuItem value="hire">Hire</MenuItem>
              <MenuItem value="consider">Consider</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          size="large"
          sx={{ 
            minWidth: 200,
            bgcolor: '#0057b7',
            '&:hover': {
              bgcolor: '#004494'
            }
          }}
        >
          Submit Evaluation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluationDialog; 