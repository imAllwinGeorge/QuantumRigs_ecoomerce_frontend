import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/Axios';
import { toast } from 'react-toastify';

const NewPasword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state;
    console.log('newpassowrd email',email)
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [error, setError] = useState({});

    const handleSubmit = async(event)=>{
        event.preventDefault();
        const newError = {};
        if(password !== confirmPassword){
            newError.password = 'both password should be same'
        }
        if(!password){
            newError.password = 'password should not be empty'
        }
        if(Object.keys(newError).length > 0){
            setError(newError);
            return;
        }
        try {
            const response = await axiosInstance.put('/change-password',{email,password});
            if(response.status === 200){
                console.log(response)
                toast(response.message)
                navigate('/home')
            }
        } catch (error) {
            console.log('handleSubmit',error.message)
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="password">New Password</label>
            <input type="password" id='password' name='password' value={password} placeholder='password' onChange={(e)=>setPassword(e.target.value)} />
            
            <label htmlFor="cofirmPassword">Confirm Password</label>
            <input type="password" id='confirmPassword' name='confirmPassword' value={confirmPassword} placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} />
            {error.password&&<span className='text-red-500'>{error.password}</span>}
            <button type='submit'>Change Password</button>
        </form>
    </div>
  )
}

export default NewPasword