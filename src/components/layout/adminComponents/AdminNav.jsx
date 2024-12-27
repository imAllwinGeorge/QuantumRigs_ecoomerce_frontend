import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './AdminNav.css'
import axiosInstance from '../../../api/Axios';



const AdminNav = () => {
    const Navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
      e.preventDefault()
      console.log('Search query:', searchQuery)
      // Handle search functionality
    }
    const handleLogout = async()=>{
      const response = await axiosInstance.get('/admin/logout')
      if(response.status === 200){
        Navigate('/adminlogin')
      }else{
        console.log(response)
      }
    }
  return (
    <div>
      <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="logo">
          <span className="logo-text">Q</span>uantum<span className="logo-text">R</span>igs
        </a>
      </div>

      <div className="navbar-search">
        <form onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="navbar-actions">
        <div className="admin-profile">
          <span className="admin-text">Admin</span>
        </div>
        <button className="logout-btn" onClick={handleLogout} >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </nav>
  

 
    
    </div>
  )
}

export default AdminNav