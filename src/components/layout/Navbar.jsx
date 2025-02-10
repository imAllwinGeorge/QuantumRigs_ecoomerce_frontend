"use client"

import { useState } from "react"
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react"
import Account from "../user/Home/account/Account"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAccountComponent, setShowAccountComponent] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center" onClick={()=>navigate('/home')} >
          <h1 className="hidden md:block text-black font-black text-2xl">
            <span className="text-6xl italic">Q</span>uantum
            <span className="text-5xl italic">R</span>igs
          </h1>
          <img src="/logo/Atomic_Orbit_Symbol-1024.png" alt="QuantumRigs" className="h-10 w-10 md:hidden" />
        </div>

        {/* Main Content */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-black bg-slate-200 p-2 rounded-md hover:bg-slate-300 transition-colors duration-200 mr-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Menu */}
          <div
            className={`lg:flex items-center ${isMenuOpen ? "absolute top-full left-0 right-0 bg-white shadow-md" : "hidden"}`}
          >
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0">
              {/* search button */}
              <div>
                <button className="text-black p-2 hover:text-[#4ade80] transition-colors duration-200" onClick={()=>navigate('/shop')} >
                  <Search size={24} />
                </button>
              </div>
              {/* Nav Links */}
              <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6">
                <a href="/home" className="text-black hover:text-[#4ade80] font-medium transition-colors duration-200">
                  Home
                </a>
                <a
                  href="/category"
                  className="text-black hover:text-[#4ade80] font-medium transition-colors duration-200"
                >
                  Categories
                </a>
                <a
                  href="/contact"
                  className="text-black hover:text-[#4ade80] font-medium transition-colors duration-200"
                >
                  Contact
                </a>
                <a href="/about" className="text-black hover:text-[#4ade80] font-medium transition-colors duration-200">
                  About
                </a>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-6 lg:ml-6">
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => setShowAccountComponent(true)}
                  onMouseLeave={() => setShowAccountComponent(false)}
                >
                  <User className="text-black hover:text-[#4ade80] transition-colors duration-200" size={24} />
                  {showAccountComponent && (
                    <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      <Account />
                    </div>
                  )}
                </div>
                <a href="/wishlist" className="text-black hover:text-[#4ade80] transition-colors duration-200">
                  <Heart size={24} />
                </a>
                <a href="/cart" className="relative text-black hover:text-[#4ade80] transition-colors duration-200">
                  <ShoppingCart size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

