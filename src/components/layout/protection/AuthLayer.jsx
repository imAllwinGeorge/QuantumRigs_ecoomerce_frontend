import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/Axios';

const AuthLayer = ({children}) => {
    const navigate = useNavigate();
    const [isVerified,setIsVarified] = useState(false);

    useEffect(()=>{
        const isAutheticated = async ()=>{
            try {
                const response = await axiosInstance.get('/admin/verify-token')
                if(response.status === 200){
                    setIsVarified(true)

                }else{
                    navigate('/adminlogin')
                }
            } catch (error) {
                console.log('isAuthenticated',error)
                navigate('/adminlogin')
            }
        }
        isAutheticated();
    },[navigate])
  return (
    <div>
        {isVerified&&children}
    </div>
  )
}

export default AuthLayer