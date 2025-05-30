import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './CompanyDashboard.css';

function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [interviews, setInterviews] = useState([]);
  const [availableInterviewers, setAvailableInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if using demo account
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.email === 'demo@company.com') {
          // Use mock data for demo
          setInterviews(getMockInterviews());
          setAvailableInterviewers(getMockInterviewers());
          setLoading(false);
          return;
        }

        // Fetch interviews
        const interviewsResponse = await axios.get('http://localhost:5001/api/interviews/company');
        setInterviews(interviewsResponse.data);

        // Fetch available interviewers
        const interviewersResponse = await axios.get('http://localhost:5001/api/interviewers/available');
        setAvailableInterviewers(interviewersResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Use mock data if API calls fail
        setInterviews(getMockInterviews());
        setAvailableInterviewers(getMockInterviewers());
        setError('Could not connect to server. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for demo account or fallback
  const getMockInterviews = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        _id: 'interview-1',
        candidate: { name: 'John Doe' },
        position: 'Frontend Developer',
        date: today,
        time: '10:00 AM',
        interviewer: { name: 'Alex Smith' },
        status: 'confirmed',
        meetingLink: '/interview/interview-1/live'
      },
      {
        _id: 'interview-2',
        candidate: { name: 'Jane Smith' },
        position: 'Backend Developer',
        date: tomorrow,
        time: '2:00 PM',
        interviewer: { name: 'Maria Johnson' },
        status: 'pending',
        meetingLink: '/interview/interview-2/live'
      },
      {
        _id: 'interview-3',
        candidate: { name: 'Mike Johnson' },
        position: 'Full Stack Developer',
        date: new Date('2023-12-15'),
        time: '11:00 AM',
        interviewer: { name: 'Robert Chen' },
        status: 'completed',
        meetingLink: '/interview/interview-3/live'
      }
    ];
  };

  const getMockInterviewers = () => {
    return [
      {
        _id: 'interviewer-1',
        name: 'Alex Smith',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 4.8,
        totalInterviews: 45,
        expertise: ['React', 'JavaScript', 'Frontend Development'],
        languages: ['English', 'Spanish'],
        availability: 'Weekdays 9 AM - 5 PM',
        hourlyRate: 75
      },
      {
        _id: 'interviewer-2',
        name: 'Maria Johnson',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4.9,
        totalInterviews: 60,
        expertise: ['Java', 'Spring', 'Backend Development'],
        languages: ['English', 'Portuguese'],
        availability: 'Weekdays 10 AM - 6 PM',
        hourlyRate: 85
      },
      {
        _id: 'interviewer-3',
        name: 'Robert Chen',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 4.7,
        totalInterviews: 38,
        expertise: ['Full Stack', 'Node.js', 'React', 'MongoDB'],
        languages: ['English', 'Mandarin'],
        availability: 'Weekdays 8 AM - 4 PM',
        hourlyRate: 80
      }
    ];
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return 'status-scheduled';
    }
  };

  const handleScheduleInterview = (interviewer) => {
    navigate('/schedule-interview', { state: { interviewer } });
  };

  const handleViewDetails = (interviewId) => {
    navigate(`/interview-details/${interviewId}`);
  };

  const handleJoinInterview = (interviewId) => {
    navigate(`/interview/${interviewId}/setup`);
  };

  if (loading) {
    return (
      <div className="company-dashboard-container">
        <div className="loading-state">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-dashboard-container">
        <div className="error-state">
          <p>{error}</p>
          <button className="action-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-dashboard-container">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <p>Manage your technical interviews</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Available Interviewers</h3>
          <div className="stat-number">{availableInterviewers.length}</div>
        </div>
        <div className="stat-card">
          <h3>Scheduled Interviews</h3>
          <div className="stat-number">
            {interviews.filter(i => ['pending', 'confirmed'].includes(i.status)).length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Completed Interviews</h3>
          <div className="stat-number">
            {interviews.filter(i => i.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="interviews-section">
        <div className="section-header">
          <h2 className="section-title">Upcoming Interviews</h2>
          <button className="action-btn" onClick={() => navigate('/schedule-interview')}>
            Schedule New Interview
          </button>
        </div>

        {interviews.length > 0 ? (
          <table className="interview-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Date & Time</th>
                <th>Interviewer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td>{interview.candidate.name}</td>
                  <td>{interview.position}</td>
                  <td>{new Date(interview.date).toLocaleDateString()} at {interview.time}</td>
                  <td>{interview.interviewer.name}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(interview.status)}`}>
                      {interview.status}
                    </span>
                  </td>
                  <td>
                    {interview.status === 'confirmed' && (
                      <button 
                        className="action-btn"
                        onClick={() => handleJoinInterview(interview._id)}
                      >
                        Join Interview
                      </button>
                    )}
                    <button 
                      className="detail-btn"
                      onClick={() => handleViewDetails(interview._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No interviews scheduled yet.</p>
            <button className="action-btn" onClick={() => navigate('/schedule-interview')}>
              Schedule Your First Interview
            </button>
          </div>
        )}
      </div>

      <div className="interviews-section">
        <div className="section-header">
          <h2 className="section-title">Available Interviewers</h2>
        </div>
        <div className="interviewers-grid">
          {availableInterviewers.map((interviewer) => (
            <div key={interviewer._id} className="interviewer-card">
              <img 
                src={interviewer.image || 'https://via.placeholder.com/150'} 
                alt={interviewer.name} 
                className="interviewer-img"
              />
              <div className="interviewer-info">
                <h3>{interviewer.name}</h3>
                <div className="rating-container">
                  <span className="star-icon">★</span>
                  <span>{interviewer.rating} ({interviewer.totalInterviews} interviews)</span>
                </div>
                <p><strong>Expertise:</strong> {interviewer.expertise.join(', ')}</p>
                <p><strong>Languages:</strong> {interviewer.languages.join(', ')}</p>
                <p><strong>Availability:</strong> {interviewer.availability}</p>
                <p><strong>Rate:</strong> ${interviewer.hourlyRate}/hour</p>
                <button 
                  className="schedule-btn"
                  onClick={() => handleScheduleInterview(interviewer)}
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;