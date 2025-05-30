import React from "react";
import "./Features.css";

const Features = () => {
  return (
    <div className="features-container">
      <h2 className="features-title">Features</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Expert Interviewers</h3>
          <p>Hire professionals with proven experience in tech hiring.</p>
        </div>
        <div className="feature-card">
          <h3>Flexible Scheduling</h3>
          <p>Book interviews at your preferred time and convenience.</p>
        </div>
        <div className="feature-card">
          <h3>Fast and Efficient</h3>
          <p>Streamline your hiring process and reduce time-to-hire.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
