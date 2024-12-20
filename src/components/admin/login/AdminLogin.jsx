import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/admin/login', {
        email,
        password
      });
      if (response.data.email) {
        Navigate('/adminhome');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <div className="admin-login-image">
          <div className="image-overlay">
            <h2 className="image-text">DO MORE.</h2>
          </div>
        </div>
        
        <div className="admin-login-form-container">
          <div className="admin-login-form-content">
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-subtitle">Only admins are allowed to login through this interface</p>
            
            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  name="email"
                  placeholder="admin@email.com"
                  className="form-input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  name="password"
                  placeholder="Enter your password"
                  className="form-input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox"
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-button">
                Login Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

