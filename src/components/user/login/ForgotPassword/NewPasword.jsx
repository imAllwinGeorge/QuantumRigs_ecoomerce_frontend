import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../api/Axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../../redux/userSlice';

const NewPasword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const email = location.state;
    console.log('newpassowrd email',email)
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [error, setError] = useState({});

    const handleSubmit = async(event)=>{
        event.preventDefault();
        const trimmedPassword = password.trim();
        const newError = {};
        if(password !== confirmPassword){
            newError.password = 'both password should be same'
        }
        if (!trimmedPassword) {
          newError.password = "Password should not be empty.";
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            password
          )
        ) {
          newError.password =
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
        }
        if(Object.keys(newError).length > 0){
            setError(newError);
            return;
        }
        try {
            const response = await axiosInstance.put('/change-password',{email,password});
            if(response.status === 200){
                console.log(response)
                dispatch(addUser(response.data))
                toast(response.message)
                navigate('/home')
            }
        } catch (error) {
            console.log('handleSubmit',error.message)
        }
    }
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md text-black border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md text-black border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {error.password && <span className="block text-sm text-red-500">{error.password}</span>}

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Change Password
        </button>
      </form>
    </div>
  </div>
  )
}

export default NewPasword