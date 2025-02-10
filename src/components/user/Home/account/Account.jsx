import React from 'react'
import axiosInstance from '../../../../api/Axios';
import { Link, useNavigate } from 'react-router-dom';
import './Account.css'
import { useDispatch } from 'react-redux';
import {logoutUser} from '../../../../redux/userSlice'


const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleClick = async()=>{
      
    //   googleLogout();
      
      try {
        const response = await axiosInstance.get('/userlogout')
        if(response.status === 200){
            dispatch(logoutUser())
            navigate('/login')
        }
      } catch (error) {
        console.log('logout',error)
      }
    
    }
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div>
        <Link to="/user-profile" className="text-black hover:text-[#4ade80] transition-colors duration-200">
          My Profile
        </Link>
      </div>
      <div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={handleClick}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Account