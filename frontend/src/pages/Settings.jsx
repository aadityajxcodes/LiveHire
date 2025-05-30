import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Tech Solutions Inc.',
    jobTitle: 'Senior Software Engineer',
    language: 'en',
    timezone: 'UTC-5',
    notifications: {
      email: true,
      browser: true,
      mobile: false,
      interviews: true,
      updates: true,
      marketing: false
    },
    darkMode: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [category, setting] = name.split('.');
      setFormData({
        ...formData,
        [category]: {
          ...formData[category],
          [setting]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to API
    console.log('Submitting form data:', formData);
    // Show success message or handle errors
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and application settings</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <ul className="settings-nav">
            <li className="settings-nav-item">
              <a 
                href="#profile" 
                className={`settings-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </a>
            </li>
            <li className="settings-nav-item">
              <a 
                href="#account" 
                className={`settings-nav-link ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account Settings
              </a>
            </li>
            <li className="settings-nav-item">
              <a 
                href="#notifications" 
                className={`settings-nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </a>
            </li>
            <li className="settings-nav-item">
              <a 
                href="#security" 
                className={`settings-nav-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security & Privacy
              </a>
            </li>
          </ul>
        </div>

        <div className="settings-main">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="submit-row">
                  <button type="button" className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                    </select>
                  </div>
                </div>

                <div className="toggle-group">
                  <span className="toggle-label">Dark Mode</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button type="button" className="danger-btn">Delete Account</button>
                </div>

                <div className="submit-row">
                  <button type="button" className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <form onSubmit={handleSubmit}>
                <h3>Notification Channels</h3>
                <div className="toggle-group">
                  <span className="toggle-label">Email Notifications</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <span className="toggle-label">Browser Notifications</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.browser"
                      checked={formData.notifications.browser}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <span className="toggle-label">Mobile Notifications</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.mobile"
                      checked={formData.notifications.mobile}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <h3>Notification Types</h3>
                <div className="toggle-group">
                  <span className="toggle-label">Interview Reminders</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.interviews"
                      checked={formData.notifications.interviews}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <span className="toggle-label">Platform Updates</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.updates"
                      checked={formData.notifications.updates}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <span className="toggle-label">Marketing & Newsletters</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notifications.marketing"
                      checked={formData.notifications.marketing}
                      onChange={handleToggleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="submit-row">
                  <button type="button" className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security & Privacy</h2>
              <form onSubmit={handleSubmit}>
                <h3>Change Password</h3>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <span className="hint-text">Password must be at least 8 characters and include uppercase, lowercase, numbers and special characters.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
                    <span className="error-text">Passwords do not match.</span>
                  )}
                </div>

                <h3>Two-Factor Authentication</h3>
                <div className="card-group">
                  <div className="card-header">
                    <span className="card-title">Enable Two-Factor Authentication</span>
                    <div className="card-actions">
                      <button type="button" className="action-btn">Setup 2FA</button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p>Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.</p>
                  </div>
                </div>

                <div className="submit-row">
                  <button type="button" className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn">Save Changes</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
