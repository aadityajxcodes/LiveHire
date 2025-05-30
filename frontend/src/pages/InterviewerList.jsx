import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { filterInterviewersBySkills, mockInterviewers } from '../services/mockData';
import '../styles/InterviewerList.css';

const InterviewerList = () => {
  const [matchedInterviewers, setMatchedInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state;

  useEffect(() => {
    const fetchMatchedInterviewers = () => {
      try {
        let filteredInterviewers;
        
        if (interviewDetails?.requiredSkills) {
          console.log('Searching with criteria:', {
            requiredSkills: interviewDetails.requiredSkills,
            date: interviewDetails.date,
            startTime: interviewDetails.startTime,
            duration: interviewDetails.duration
          });
          filteredInterviewers = filterInterviewersBySkills(interviewDetails.requiredSkills);
        } else {
          // If no specific requirements, show all interviewers
          filteredInterviewers = mockInterviewers;
        }

        console.log('Matched interviewers:', filteredInterviewers);
        setMatchedInterviewers(filteredInterviewers);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching matched interviewers:', error);
        setError('Failed to fetch interviewers. Please try again.');
        setLoading(false);
      }
    };

    fetchMatchedInterviewers();
  }, [interviewDetails]);

  const handleRequestInterviewer = async (interviewerId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call success
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: 'Interview request sent successfully!',
            success: true
          }
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error requesting interviewer:', error);
      setError('Failed to book the interview. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Finding matching interviewers...</p>
      </div>
    );
  }

  return (
    <div className="interviewer-list-container">
      <h1>Available Interviewers</h1>
      <p className="subtitle">
        {interviewDetails?.jobTitle 
          ? `Matching your requirements for ${interviewDetails.jobTitle}`
          : 'All available interviewers'
        }
      </p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {matchedInterviewers.length === 0 ? (
        <div className="no-matches">
          <h2>No matching interviewers found</h2>
          <p>Try adjusting your requirements or selecting a different time slot</p>
          <button onClick={() => navigate('/schedule-interview')}>
            Back to Schedule Interview
          </button>
        </div>
      ) : (
        <div className="interviewers-grid">
          {matchedInterviewers.map((interviewer) => (
            <div key={interviewer._id} className="interviewer-card">
              <div className="interviewer-profile">
                <img 
                  src={interviewer.profileImage} 
                  alt={interviewer.name}
                  className="profile-image"
                />
                <div className="profile-info">
                  <h2>{interviewer.name}</h2>
                  <span className="location">{interviewer.location}</span>
                  <span className="experience">{interviewer.yearsOfExperience} years exp.</span>
                </div>
              </div>
              
              <div className="skills-container">
                <h3>Skills</h3>
                <div className="skills-list">
                  {interviewer.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="interviewer-stats">
                <div className="stat">
                  <span className="stat-label">Interviews</span>
                  <span className="stat-value">{interviewer.interviewsCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{interviewer.rating.toFixed(1)}/5</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Rate</span>
                  <span className="stat-value">${interviewer.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="specialization">
                <h3>Specialization</h3>
                <p>{interviewer.specialization}</p>
              </div>

              <div className="available-slots">
                <h3>Available Time Slots</h3>
                <div className="slots-list">
                  {interviewer.availableSlots.map((slot, index) => (
                    <span key={index} className="time-slot">
                      {slot.startTime}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="request-button"
                onClick={() => handleRequestInterviewer(interviewer._id)}
                disabled={loading}
              >
                {loading ? 'Sending Request...' : 'Request Interviewer'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewerList; 