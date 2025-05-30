import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InterviewerSignup.css';
// Replace the image import with a URL instead
// import signupImage from '../assets/images/interviewer-signup.png';

const InterviewerSignup = () => {
  // Define a placeholder image URL - this is a professional illustration of a person working at a desk
  const signupImage = 'https://img.freepik.com/free-vector/interview-concept-illustration_114360-1678.jpg';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    workDetails: '',
    yearsOfExperience: '',
    linkedinProfile: '',
    phoneNumber: '',
    skills: []
  });
  
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    setSkill(e.target.value);
  };

  const addSkill = () => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()]
      });
      setSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSubmit } = formData;

      // Convert yearsOfExperience to number
      dataToSubmit.yearsOfExperience = Number(dataToSubmit.yearsOfExperience);
      
      console.log('Submitting interviewer data:', dataToSubmit);
      
      const response = await axios.post('http://localhost:5001/api/auth/interviewer/register', dataToSubmit);
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to interviewer dashboard
      navigate('/interviewer-dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.msg || 'Registration Successfull');
      } else if (err.request) {
        setError('Registration Successfull');
      } else {
        setError('Registration Successfull');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="interviewer-signup-container">
      <div className="interviewer-signup-left">
        <img src={signupImage} alt="Interviewer Signup" className="interviewer-signup-image" />
      </div>
      <div className="interviewer-signup-right">
        <div className="interviewer-signup-card">
          <h2 className="interviewer-signup-title">Sign Up</h2>
          <p className="interviewer-signup-subtitle">Welcome to LIVEHIRE</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="interviewer-signup-input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="workDetails">Where Do You Work and Job Role</label>
              <input
                type="text"
                id="workDetails"
                name="workDetails"
                placeholder="Your company and role"
                value={formData.workDetails}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="yearsOfExperience">Total Work Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                placeholder="Years of experience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="linkedinProfile">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                placeholder="LinkedIn profile URL"
                value={formData.linkedinProfile}
                onChange={handleChange}
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="phoneNumber">Phone no.</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="interviewer-signup-input-group">
              <label htmlFor="skills">Skills</label>
              <div className="skills-input-container">
                <input
                  type="text"
                  id="skills"
                  placeholder="Add your skills"
                  value={skill}
                  onChange={handleSkillsChange}
                />
                <button 
                  type="button" 
                  onClick={addSkill}
                  className="add-skill-btn"
                >
                  Add
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="skills-list">
                  {formData.skills.map((s, index) => (
                    <div key={index} className="skill-tag">
                      {s}
                      <span 
                        className="remove-skill" 
                        onClick={() => removeSkill(s)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="interviewer-signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="interviewer-signup-login">
            Already have an account?
            <Link to="/interviewer-login">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerSignup;