import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InterviewerLogin.css';
// Replace the image import with a URL instead
// import loginImage from '../assets/images/interviewer-login.png';

const InterviewerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Define a placeholder image URL - this is a professional illustration of a person working
  const loginImage = 'https://img.freepik.com/free-vector/work-time-concept-illustration_114360-1474.jpg';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo login functionality (works without backend)
    if (formData.email === 'demo@interviewer.com' && formData.password === 'demo123') {
      // Create mock user data
      const demoUser = {
        _id: 'demo-interviewer-123',
        name: 'Demo Interviewer',
        email: formData.email,
        role: 'interviewer',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: '5 years',
        rating: 4.8,
        availability: 'Weekdays 9 AM - 5 PM',
        hourlyRate: 50,
        totalInterviews: 150,
        languages: ['English', 'Spanish'],
        expertise: ['Frontend Development', 'Backend Development', 'System Design']
      };
      
      // Store demo token and user data
      localStorage.setItem('token', 'demo-token-interviewer-123');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Short delay to simulate API call
      setTimeout(() => {
        navigate('/interviewer-dashboard');
        setIsLoading(false);
      }, 1000);
      
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/auth/interviewer/login', formData);
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to interviewer dashboard
      navigate('/interviewer-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.msg || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create mock user data
    const demoUser = {
      _id: 'demo-interviewer-123',
      name: 'Demo Interviewer',
      email: 'demo@interviewer.com',
      role: 'interviewer',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experience: '5 years',
      rating: 4.8,
      availability: 'Weekdays 9 AM - 5 PM',
      hourlyRate: 50,
      totalInterviews: 150,
      languages: ['English', 'Spanish'],
      expertise: ['Frontend Development', 'Backend Development', 'System Design']
    };
    
    // Store demo token and user data
    localStorage.setItem('token', 'demo-token-interviewer-123');
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Force a redirect to interviewer dashboard
    window.location.href = '/interviewer-dashboard';
  };

  return (
    <div className="interviewer-login-container">
      <div className="interviewer-login-left">
        <img src={loginImage} alt="Interviewer Login" className="interviewer-login-image" />
      </div>
      <div className="interviewer-login-right">
        <div className="interviewer-login-card">
          <h2 className="interviewer-login-title">Interviewer Login</h2>
          <p className="interviewer-login-subtitle">Welcome To LiveHire</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form id="interviewer-login-form" onSubmit={handleSubmit}>
            <div className="interviewer-login-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-login-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="interviewer-login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : ''}
            </button>
          </form>
          
          <button 
            onClick={handleDemoLogin}
            className="demo-login-button"
            disabled={isLoading}
          >
            LOGIN
          </button>
          
          <div className="interviewer-login-signup">
            Don't have an account?
            <Link to="/interviewer-signup">
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerLogin;