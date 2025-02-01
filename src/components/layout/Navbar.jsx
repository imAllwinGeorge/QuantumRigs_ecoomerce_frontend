import React, { useState } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart } from 'lucide-react';
import Account from "../user/Home/account/Account";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountComponent, setShowAccountComponent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md z-100 px-4 py-4 "  >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">
        {/* Logo Section */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center">
            
            <h1 className="hidden md:block text-black font-black text-2xl ">
              <span className="text-6xl italic">Q</span>uantum
              <span className="text-5xl italic">R</span>igs
            </h1>
            <img
              src="/logo/Atomic_Orbit_Symbol-1024.png"
              alt="QuantumRigs"
              className="h-10 w-10 md:hidden"
            />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-black bg-slate-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} className="bg-slate-200" />}
          </button>
        </div>

        {/* Main Content */}
        <div className={`w-full lg:flex lg:items-center lg:justify-between ${isMenuOpen ? 'block' : 'hidden'}`}>
          {/* Search Bar */}
          <div className="flex items-center justify-center mt-4  lg:mt-0 lg:mx-8">
            {/* <div className="flex w-full max-w-[600px] h-[50px] bg-[#f0f0f0] rounded-full items-center px-2 ">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
               
                 className="flex-auto !bg-transparent !border-none px-4 text-xs outline-none mx-5 my-2 appearance-none focus:outline-none focus:ring-0"
              />
              <button className="flex items-center gap-2 bg-[#4ade80] text-black mt-5 px-4 py-2 rounded-full font-normal hover:bg-[#22c55e] transition-colors  mb-5">
                <Search size={16} />
                Search
              </button>
            </div> */}
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col lg:flex-row items-center mt-4 mr-0 lg:mt-0 space-y-4 lg:space-y-0">
            {/* Nav Links */}
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-8">
              <a href="/home" className="text-black hover:text-[#4ade80] font-medium">Home</a>
              <a href="/category" className="text-black hover:text-[#4ade80] font-medium">Categories</a>
              <a href="/contact" className="text-black hover:text-[#4ade80] font-medium">Contact</a>
              <a href="/about" className="text-black hover:text-[#4ade80] font-medium">About</a>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6 lg:ml-8">
              <div 
                className="relative cursor-pointer"
                onMouseEnter={() => setShowAccountComponent(true)}
                onMouseLeave={() => setShowAccountComponent(false)}
              >
                <User className="text-black hover:text-[#4ade80]" size={24} />
                {showAccountComponent && (
                  <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-5 z-50">
                    <Account />
                  </div>
                )}
              </div>
              <a href="/wishlist" className="text-black hover:text-[#4ade80]">
                <Heart size={24} />
              </a>
              <a href="/cart" className="relative text-black hover:text-[#4ade80]">
                <ShoppingCart size={24} />
                {/* <span className="absolute -top-2 -right-2 bg-[#4ade80] text-black w-[18px] h-[18px] text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span> */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

