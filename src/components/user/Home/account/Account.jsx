import React from 'react'
import axiosInstance from '../../../../api/Axios';
import { useNavigate } from 'react-router-dom';
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
        <button className='logout-btn' onClick={handleClick} >logout</button>
    </div>
  )
}

export default Account