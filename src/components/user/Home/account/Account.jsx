import React from 'react'
import axiosInstance from '../../../../api/Axios';
import { Link, useNavigate } from 'react-router-dom';
import './Account.css'


const Account = () => {
    const navigate = useNavigate();
    
    const handleClick = async()=>{
      
    //   googleLogout();
      
      try {
        const response = await axiosInstance.get('/userlogout')
        if(response.status === 200){
            navigate('/login')
        }
      } catch (error) {
        console.log('logout',error)
      }
    
    }
  
  return (
    <div className='accout-container'>
     <div> <Link to={'/user-profile'} className='text-black ' >My Profile</Link></div>
        <div><button className='logout-btn' onClick={handleClick} >logout</button></div>
    </div>
  )
}

export default Account