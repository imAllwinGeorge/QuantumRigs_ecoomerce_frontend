import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/Axios';
import { LogOut, Search } from 'lucide-react';



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
    <nav className="bg-[#111] border-b 0">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="text-white text-xl font-semibold  ">
            <span className="text-white text-5xl font-bold italic ">Q</span>uantum
            <span className="text-white text-4xl italic font-bold">R</span>igs
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden sm:block">
          {/* <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#222] text-white placeholder-gray-400 rounded-md pl-4 pr-10 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form> */}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="text-white font-medium hidden sm:block">Admin</div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Search Button */}
        <button 
          className="sm:hidden text-gray-400 hover:text-white transition-colors p-2"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}

export default AdminNav