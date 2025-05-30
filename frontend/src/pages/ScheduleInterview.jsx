// ScheduleInterview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ScheduleInterview.css';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState({
    jobTitle: '',
    requiredSkills: [],
    candidateName: '',
    candidateEmail: '',
    date: '',
    startTime: '',
    duration: 60,
    currentSkill: ''
  });
  
  // Results states
  const [step, setStep] = useState(1); // 1: Form, 2: Results
  const [availableInterviewers, setAvailableInterviewers] = useState([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get tomorrow's date for min date attribute
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (formData.currentSkill.trim()) {
      if (!formData.requiredSkills.includes(formData.currentSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, formData.currentSkill.trim()],
          currentSkill: ''
        }));
      }
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (!formData.jobTitle.trim()) {
      setError('Please enter a job title');
      setLoading(false);
      return;
    }

    if (formData.requiredSkills.length === 0) {
      setError('Please add at least one required skill');
      setLoading(false);
      return;
    }

    if (!formData.candidateName.trim()) {
      setError('Please enter candidate name');
      setLoading(false);
      return;
    }

    if (!formData.candidateEmail.trim()) {
      setError('Please enter candidate email');
      setLoading(false);
      return;
    }

    if (!formData.date) {
      setError('Please select a date');
      setLoading(false);
      return;
    }

    if (!formData.startTime) {
      setError('Please select a start time');
      setLoading(false);
      return;
    }
    
    try {
      // Navigate to interviewer list with all the form data
      navigate('/interviewer-list', {
        state: {
          jobTitle: formData.jobTitle,
          requiredSkills: formData.requiredSkills,
          candidateName: formData.candidateName,
          candidateEmail: formData.candidateEmail,
          date: formData.date,
          startTime: formData.startTime,
          duration: parseInt(formData.duration)
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle interviewer selection
  const handleSelectInterviewer = (interviewer) => {
    setSelectedInterviewer(interviewer);
  };
  
  // Handle confirming interview booking
  const handleConfirmBooking = async () => {
    if (!selectedInterviewer) return;
    
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, call the API to book the interview
      const response = await axios.post('http://localhost:5001/api/interviews', {
        interviewerId: selectedInterviewer.id,
        jobDetails: {
          title: formData.jobTitle,
          skills: formData.requiredSkills
        },
        schedule: {
          date: formData.date,
          startTime: formData.startTime,
          duration: parseInt(formData.duration)
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Navigate to dashboard on success
      navigate('/company-dashboard');
    } catch (err) {
      console.error('Error booking interview:', err);
      setError('Failed to book the interview. Please try again later.');
      
      // For demo, navigate anyway
      setTimeout(() => {
        navigate('/company-dashboard');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  
  // Mock data for demo purposes
  const getMockInterviewers = () => {
    return [
      {
        id: 1,
        name: 'Alice Smith',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '5 years',
        rating: 4.8,
        hourlyRate: 50,
        availability: ['9:00 AM', '11:00 AM', '2:00 PM'],
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 2,
        name: 'John Davis',
        skills: ['Python', 'Django', 'Machine Learning'],
        experience: '7 years',
        rating: 4.9,
        hourlyRate: 65,
        availability: ['10:00 AM', '1:00 PM', '4:00 PM'],
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 3,
        name: 'Sarah Johnson',
        skills: ['Java', 'Spring Boot', 'Microservices'],
        experience: '6 years',
        rating: 4.7,
        hourlyRate: 55,
        availability: ['9:30 AM', '12:30 PM', '3:30 PM'],
        image: 'https://randomuser.me/api/portraits/women/68.jpg'
      }
    ];
  };

  return (
    <div className="schedule-interview-container">
      <div className="schedule-header">
        <h1>Schedule an Interview</h1>
        <p>Find expert interviewers for your technical hiring process</p>
      </div>
      
      {step === 1 ? (
        <div className="schedule-form-container">
      <form onSubmit={handleSubmit} className="schedule-form">
            <div className="form-section">
              <h2>Job Details</h2>
              <div className="form-group">
                <label htmlFor="jobTitle">Job Title</label>
          <input
                  id="jobTitle"
            type="text"
                  placeholder="e.g. Frontend Developer"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
            required
          />
              </div>
              
              <div className="form-group">
                <label>Required Skills</label>
                <div className="skills-input-container">
                  <input
                    id="currentSkill"
                    type="text"
                    placeholder="Add a skill and press Enter"
                    name="currentSkill"
                    value={formData.currentSkill}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(e);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="add-skill-btn"
                    onClick={handleAddSkill}
                  >
                    Add
                  </button>
                </div>
                
                <div className="skills-container">
                  {formData.requiredSkills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      {skill}
                      <span 
                        className="remove-skill"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Candidate Information</h2>
              <div className="form-group">
                <label htmlFor="candidateName">Candidate Name</label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  placeholder="Enter candidate's full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="candidateEmail">Candidate Email</label>
                <input
                  type="email"
                  id="candidateEmail"
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleInputChange}
                  placeholder="Enter candidate's email address"
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>Schedule</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
          <input
                    id="date"
            type="date"
            name="date"
            value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
          />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Start Time</label>
          <input
                    id="startTime"
            type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
            required
          />
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/company-dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !formData.requiredSkills.length}
              >
                {loading ? 'Processing...' : 'Find Interviewers'}
        </button>
            </div>
      </form>
        </div>
      ) : (
        <div className="interviewers-results-container">
          <div className="results-header">
            <h2>Available Interviewers</h2>
            <p>Select an interviewer that matches your requirements</p>
          </div>
          
          <div className="interviewers-grid">
            {availableInterviewers.map((interviewer) => (
              <div 
                key={interviewer.id} 
                className={`interviewer-card ${selectedInterviewer?.id === interviewer.id ? 'selected' : ''}`}
                onClick={() => handleSelectInterviewer(interviewer)}
              >
                <div className="interviewer-image">
                  <img src={interviewer.image} alt={interviewer.name} />
                  <div className="interviewer-rating">
                    <span>★</span> {interviewer.rating}
                  </div>
                </div>
                
                <div className="interviewer-info">
                  <h3>{interviewer.name}</h3>
                  <p><strong>Experience:</strong> {interviewer.experience}</p>
                  <p><strong>Rate:</strong> ${interviewer.hourlyRate}/hour</p>
                  
                  <div className="interviewer-skills">
                    {interviewer.skills.map((skill, index) => (
                      <span key={index} className="skill-tag small">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="availability-slots">
                    <p><strong>Available at:</strong></p>
                    <div className="time-slots">
                      {interviewer.availability.map((time, index) => (
                        <span key={index} className="time-slot">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="selection-indicator">
                  {selectedInterviewer?.id === interviewer.id && <span>✓</span>}
                </div>
              </div>
            ))}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="booking-actions">
            <button 
              className="back-btn"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="book-btn"
              disabled={!selectedInterviewer || loading}
              onClick={handleConfirmBooking}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleInterview;