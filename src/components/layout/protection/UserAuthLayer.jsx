import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../api/Axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const UserAuthLayer = ({children}) => {
    const navigate = useNavigate();
    const [verified,setVerified] = useState(false);

    useEffect(()=>{
        const verifyToken = async() => {
            try {
                const response = await axiosInstance.get('/verify-token')
                console.log(response)
                if(response.status === 200){
                    setVerified(true)
                }else{
                    navigate('/login')
                }
            } catch (error) {
                console.log('verify token',error)
                
                navigate('/login')
               
            }
        }
        verifyToken();
    },[navigate])
  return (
    <div>
        {verified&&children}
    </div>
  )
}

export default UserAuthLayer