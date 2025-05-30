import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    bio: '',
    skills: [],
    experiences: []
  });

  // New skill input
  const [newSkill, setNewSkill] = useState('');
  
  // New experience form
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      // Populate profile data from user object
      setProfileData({
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ')[1] || '' : '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experiences: user.experiences || []
      });
    }
  }, [user]);

  // Handle input changes for profile data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Add a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle input changes for new experience
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience({
      ...newExperience,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // If "current" is checked, clear the end date
    if (name === 'current' && checked) {
      setNewExperience({
        ...newExperience,
        current: true,
        endDate: ''
      });
    }
  };

  // Add a new experience
  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      const experienceToAdd = {
        ...newExperience,
        id: Date.now().toString() // Simple unique ID
      };
      
      setProfileData({
        ...profileData,
        experiences: [...profileData.experiences, experienceToAdd]
      });
      
      // Reset the form
      setNewExperience({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  // Remove an experience
  const handleRemoveExperience = (experienceId) => {
    setProfileData({
      ...profileData,
      experiences: profileData.experiences.filter(exp => exp.id !== experienceId)
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      // Format the data for API
      const userData = {
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        jobTitle: profileData.jobTitle,
        bio: profileData.bio,
        skills: profileData.skills,
        experiences: profileData.experiences
      };
      
      // API call would go here
      // For demo purposes, we'll just update local state
      updateUser(userData);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your profile information and credentials</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-container">
            <img 
              src={user?.avatar || "https://via.placeholder.com/150?text=User"} 
              alt="Profile" 
              className="profile-avatar" 
            />
            <h2 className="profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
            <p className="profile-role">{user?.role === 'interviewer' ? 'Interviewer' : 'Company HR'}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Interviews Conducted</span>
              <span className="stat-value">{user?.interviewsCount || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value">{user?.averageRating || "N/A"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className={`sidebar-btn ${isEditing ? 'secondary-btn' : 'primary-btn'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            
            <button 
              className="sidebar-btn secondary-btn"
              onClick={() => navigate('/settings')}
            >
              Account Settings
            </button>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-tabs">
            <div 
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </div>
            <div 
              className={`profile-tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills & Expertise
            </div>
            <div 
              className={`profile-tab ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </div>
          </div>

          {activeTab === 'personal' && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company/Organization</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="jobTitle">Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={profileData.jobTitle}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio/About</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={5}
                  placeholder="Tell us about yourself, your expertise, and interview experience..."
                />
              </div>

              {isEditing && (
                <div className="submit-row">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="profile-section">
              <h2>Skills & Expertise</h2>
              
              {isEditing && (
                <div className="form-row" style={{ alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 3 }}>
                    <label htmlFor="newSkill">Add a Skill</label>
                    <input
                      type="text"
                      id="newSkill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g., JavaScript, React, Java, System Design"
                    />
                  </div>
                  <div style={{ flex: 1, marginBottom: '1.2rem' }}>
                    <button 
                      type="button" 
                      className="submit-btn"
                      onClick={handleAddSkill}
                      style={{ width: '100%', margin: 0 }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              
              <div className="skills-list">
                {profileData.skills.length === 0 ? (
                  <p>No skills added yet. Add skills to showcase your expertise.</p>
                ) : (
                  profileData.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      {skill}
                      {isEditing && (
                        <span 
                          className="remove-skill"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {isEditing && (
                <div className="submit-row">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="submit-btn"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="profile-section">
              <h2>Work Experience</h2>
              
              {profileData.experiences.length === 0 ? (
                <p>No experience added yet. Add your relevant work experience.</p>
              ) : (
                profileData.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="experience-item">
                    <div className="experience-header">
                      <div>
                        <h3 className="experience-title">{exp.title}</h3>
                        <p className="experience-company">{exp.company}</p>
                        <p className="experience-period">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {isEditing && (
                        <div className="experience-actions">
                          <span 
                            className="action-icon remove-skill"
                            onClick={() => handleRemoveExperience(exp.id)}
                          >
                            ×
                          </span>
                        </div>
                      )}
                    </div>
                    <p>{exp.description}</p>
                  </div>
                ))
              )}
              
              {isEditing && (
                <div>
                  <h3>Add New Experience</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">Job Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newExperience.title}
                        onChange={handleExperienceChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={newExperience.company}
                        onChange={handleExperienceChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="month"
                        id="startDate"
                        name="startDate"
                        value={newExperience.startDate}
                        onChange={handleExperienceChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="month"
                        id="endDate"
                        name="endDate"
                        value={newExperience.endDate}
                        onChange={handleExperienceChange}
                        disabled={newExperience.current}
                      />
                      <div style={{ marginTop: '0.5rem' }}>
                        <label>
                          <input
                            type="checkbox"
                            name="current"
                            checked={newExperience.current}
                            onChange={handleExperienceChange}
                            style={{ width: 'auto', marginRight: '0.5rem' }}
                          />
                          I currently work here
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newExperience.description}
                      onChange={handleExperienceChange}
                      rows={3}
                      placeholder="Describe your role and responsibilities..."
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="submit-btn"
                    onClick={handleAddExperience}
                    style={{ marginBottom: '2rem' }}
                  >
                    Add Experience
                  </button>
                  
                  <div className="submit-row">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="submit-btn"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 