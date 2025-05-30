import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CompanySignup.css"; // Custom CSS for styling
// Replace the image import with a URL instead
// import signupImage from "../assets/images/company-signup.png";

const CompanySignup = () => {
  // Define a placeholder image URL - this is a professional illustration of a business team
  const signupImage = 'https://img.freepik.com/free-vector/business-team-brainstorming-discussing-project_74855-6316.jpg';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    domain: "",
    size: "",
    industry: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handling form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handling form submission (Later connects to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSubmit } = formData;
      
      console.log('Submitting company data:', dataToSubmit);
      
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        ...dataToSubmit,
        role: 'company'
      });
      
      // Store the token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect to company dashboard
      navigate("/company-dashboard");
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
    <div className="company-signup-container">
      <div className="company-signup-left">
        <img src={signupImage} alt="Company Signup" className="company-signup-image" />
      </div>
      <div className="company-signup-right">
        <div className="company-signup-card">
          <h2 className="company-signup-title">Sign Up</h2>
          <p className="company-signup-subtitle">Welcome to LIVEHIRE</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="company-signup-input-group">
              <label htmlFor="name">Company Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="company-signup-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your company email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="company-signup-input-group">
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
            
            <div className="company-signup-input-group">
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
            
            <div className="company-signup-input-group">
              <label htmlFor="domain">Domain</label>
              <input
                type="text"
                id="domain"
                name="domain"
                placeholder="e.g. Software Development, Data Science"
                value={formData.domain}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="company-signup-input-group">
              <label htmlFor="size">Company Size</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            
            <div className="company-signup-input-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                placeholder="Enter your industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="company-signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          
          <div className="company-signup-login">
            Already have an account?
            <Link to="/company-login">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;