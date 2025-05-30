import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const whyLivehireRef = useRef(null);
  const benefitsRef = useRef(null);
  const contactUsRef = useRef(null);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth"
    });
  };

  return (
    <div className="home-container">
      {/* Header/Navigation Bar */}
      <header className="header">
        <div className="logo">
          <Link to="/">LIVEHIRE</Link>
        </div>
        <nav className="navigation">
          <ul>
            <li onClick={() => scrollToSection(whyLivehireRef)}>Why LIVEHIRE?</li>
            <li onClick={() => scrollToSection(benefitsRef)}>Benefits</li>
            <li onClick={() => scrollToSection(contactUsRef)}>Contact Us</li>
          </ul>
        </nav>
        <Link to="/login-selection" className="home-login-button">Login</Link>
      </header>

      {/* Hero Section */}
      <section id="hero">
        <div className="hero-container">
          <h1>
            <span className="text">Optimize Your </span>
            <span className="text bold-blue">Engineering Resources</span>
          </h1>
          <div className="hero-images">
            <img src="/images/hero1.png" alt="Main Hero" className="main-hero" />
          </div>
        </div>
      </section>

      {/* Why LIVEHIRE Section */}
      <section id="why-livehire" ref={whyLivehireRef}>
        <h2 className="section-title">Why LIVEHIRE?</h2>
        <p className="why-livehire-text">
          We handle interviews so your tech team can focus on innovation.
        </p>
        <div className="interview-interface">
          <img src="/images/feature1.png" alt="Interview Interface" />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" ref={benefitsRef}>
        <h2 className="section-title">Our Top Notch Benefits</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <h3>Interview Credentials</h3>
          </div>
          <div className="benefit-item">
            <h3>Report in 120 minutes</h3>
          </div>
          <div className="benefit-item">
            <h3>Rubrics Based Hiring</h3>
          </div>
        </div>

        <h2 className="section-title features-title">Features</h2>
        <div className="features-container">
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
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="contact-section" ref={contactUsRef}>
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Name" />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <textarea placeholder="Message"></textarea>
          </div>
          <button className="submit-button">Send Message</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <h3 className="footer-heading">LIVEHIRE</h3>
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">Company</h4>
              <ul className="footer-list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-list">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Social</h4>
              <div className="social-icons">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Facebook</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 LiveHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;