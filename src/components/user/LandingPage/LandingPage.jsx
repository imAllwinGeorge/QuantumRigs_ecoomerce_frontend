import React from "react";
import "./LandingPage.css";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
 
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header ">
        <h1 className="font-bold px-10 text-2xl">
          <span className="logo-header">Q</span>uantum
          <span className="logo-header">R</span>igs
        </h1>
        <nav className="nav-menu px-10">
          <Link to="/home" className="landing-link font-bold">
            Home
          </Link>
          <Link to="/shop" className="landing-link font-bold">
            shop
          </Link>
          <Link to="/about" className="landing-link font-bold">
            about
          </Link>
          <Link to="/contact" className="landing-link font-bold">
            contact
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>CYBER MONDAY</h2>
            <p>Incredible deals on gaming PCs and components</p>
            <button className="shop-button" onClick={() => navigate("/shop")}>
              Shop Now
            </button>
          </div>
          <div className="hero-image" onClick={() => navigate("/home")}>
            <img
              src="/banners/01733141860CYBER MONDAY LIAN LI SALE BANNER-desktop.jpg"
              alt="Gaming PC"
            />
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About QuantumRigs</h3>
            <p>
              Your trusted partner for high-performance computing solutions.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>Email: info@quantumrigs.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Tech Street</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Newsletter</h3>
            <div className="newsletter">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 QuantumRigs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
