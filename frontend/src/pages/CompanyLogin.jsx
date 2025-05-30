import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/config';
import '../styles/CompanyLogin.css';
import { useAuth } from '../contexts/AuthContext';

const CompanyLogin = () => {
  // Define a placeholder image URL - this is a professional illustration of a company office
  const loginImage = 'https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle_74855-5236.jpg';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Make sure we're using the correct endpoint
      const response = await api.post('/auth/company/login', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.data && response.data.token) {
        // Store the token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update auth context
        login(response.data.user);
        
        // Redirect to company dashboard
        navigate('/company-dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with an error
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        // Request was made but no response
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock successful login
    const demoUser = {
      _id: 'demo-company-123',
      name: 'Demo Company',
      email: 'demo@company.com',
      role: 'company',
      companyName: 'TechCorp Solutions',
      industry: 'Software Development',
      size: '51-200',
      domain: 'Technology',
      location: 'San Francisco, CA',
      website: 'www.techcorp.com',
      description: 'Leading software development company specializing in innovative solutions.'
    };
    
    localStorage.setItem('token', 'demo-token-company-123');
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Force a redirect to company dashboard
    window.location.href = '/company-dashboard';
  };

  return (
    <div className="company-login-container">
      <div className="company-login-left">
        <img src={loginImage} alt="Company Login" className="company-login-image" />
      </div>
      <div className="company-login-right">
        <div className="company-login-card">
          <h2 className="company-login-title">Company Login</h2>
          <p className="company-login-subtitle">Welcome To LiveHire</p>
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="company-login-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="company-login-input-group">
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
              className="company-login-button"
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
          
          <div className="company-login-signup">
            Don't have an account?
            <Link to="/company-signup">
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;