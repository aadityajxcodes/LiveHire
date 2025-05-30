import React from 'react';
import { Link } from 'react-router-dom';
import './LoginSelection.css';

const LoginSelection = () => {
  return (
    <div className="login-selection-container">
      {/* Header/Navigation Bar */}
      <header className="header">
        <div className="logo">
          <Link to="/">LIVEHIRE</Link>
        </div>
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="login-selection-content">
        <div className="login-header">
          <h1>Choose Your Role</h1>
          <p>Select how you want to use LiveHire</p>
        </div>

        <div className="login-cards-container">
          <div className="login-card interviewer">
            <div className="card-content">
              <div className="card-header">
                <h2>Interviewer</h2>
                <div className="badge highlight">Earn up to ₹1L/month</div>
              </div>
              <p>Join our community of freelance interviewers. Conduct technical interviews and earn while sharing your expertise.</p>
              <ul className="features-list">
                <li>✓ Flexible schedule</li>
                <li>✓ Competitive compensation</li>
                <li>✓ Professional growth</li>
              </ul>
              <Link to="/interviewer-login" className="login-button interviewer-button">
                Login as Interviewer
              </Link>
            </div>
          </div>

          <div className="login-card company">
            <div className="card-content">
              <div className="card-header">
                <h2>Company</h2>
                <div className="badge highlight">Hire 3x Faster</div>
              </div>
              <p>Access our platform to streamline your technical hiring process with vetted interviewers.</p>
              <ul className="features-list">
                <li>✓ Expert interviewers</li>
                <li>✓ Detailed reports</li>
                <li>✓ Quick turnaround</li>
              </ul>
              <Link to="/company-login" className="login-button company-button">
                Login as Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;