import React, { useState } from "react";
import "./Navbar.css";
import Account from "../user/Home/account/Account";

const navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountComponent,setShowAccountComponent] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>QuantumRigs</h1>
      </div>
      
      <div className="navbar-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search
          </button>
        </div>

        <div className="nav-menu">
          <div className="nav-links">
            <a href="/" className="active">Home</a>
            <a href="/category">Categories</a>
            {/* <a href="/brands">Brands</a> */}
            <a href="/contact">Contact</a>
            <a href="/about">About</a>
          </div>

          <div className="nav-icons" >
            <div className="icon-link user-btn" onMouseEnter={()=>setShowAccountComponent(true) } onMouseLeave={()=>setShowAccountComponent(false)} >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                color="black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div>{showAccountComponent&&<Account/>}</div>
            </div>
           
            

            <a href="/wishlist" className="icon-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                color="black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </a>
            <a href="/cart" className="icon-link cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                color="black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-count">0</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default navbar;

