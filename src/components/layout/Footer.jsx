import React from 'react'

const footer = () => {
  return (
    <div>
        <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About QuantumRigs</h3>
            <p>Your trusted partner for high-performance computing solutions.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Products</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Support</a></li>
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
  )
}

export default footer