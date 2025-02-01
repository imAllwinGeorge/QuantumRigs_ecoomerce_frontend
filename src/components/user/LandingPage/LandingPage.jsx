import React from 'react'
import './LandingPage.css'
import { Link, useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate();
  const featuredProducts = [
    { id: 1, name: "Gaming PC Case", price: 199.99, rating: 5, image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "RGB Tower Case", price: 149.99, rating: 4, image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Compact Case", price: 99.99, rating: 4, image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Premium Case", price: 299.99, rating: 5, image: "/placeholder.svg?height=200&width=200" },
  ]

  const laptops = [
    { id: 1, name: "Gaming Laptop Pro", price: 1299.99, rating: 5, image: "/placeholder.svg?height=150&width=200" },
    { id: 2, name: "Business Laptop", price: 999.99, rating: 4, image: "/placeholder.svg?height=150&width=200" },
    { id: 3, name: "Student Laptop", price: 799.99, rating: 4, image: "/placeholder.svg?height=150&width=200" },
    { id: 4, name: "Workstation Laptop", price: 1499.99, rating: 5, image: "/placeholder.svg?height=150&width=200" },
  ]

  return (
    <div className="landing-page"  >
      {/* Header */}
      <header className="header">
        <h1><span className='logo-header'>Q</span>uantum<span className='logo-header' >R</span>igs</h1>
        <nav className="nav-menu">
          <Link to='/home' className='landing-link' >Home</Link>
          <a href="#">Products</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>CYBER MONDAY</h2>
            <p>Incredible deals on gaming PCs and components</p>
            <button className="shop-button">Shop Now</button>
          </div>
          <div className="hero-image">
            <img src="/banners/01733141860CYBER MONDAY LIAN LI SALE BANNER-desktop.jpg" alt="Gaming PC" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className="product-details">
                <span className="price">${product.price}</span>
                <span className="rating">
                  {'★'.repeat(product.rating)}
                  {'☆'.repeat(5 - product.rating)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Laptops Section */}
      {/* <section className="laptops-section">
        <h2>Laptops</h2>
        <div className="products-grid">
          {laptops.map((laptop) => (
            <div key={laptop.id} className="product-card">
              <img src={laptop.image} alt={laptop.name} />
              <h3>{laptop.name}</h3>
              <div className="product-details">
                <span className="price">${laptop.price}</span>
                <span className="rating">
                  {'★'.repeat(laptop.rating)}
                  {'☆'.repeat(5 - laptop.rating)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Footer */}
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

export default LandingPage

