import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(true);
  const [email,setEmail] = useState('');

  // Start timer as soon as component mounts
  useEffect(() => {
    let timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!isActive) {
      toast.error('Time expired! Please resend OTP');
      return;
    }

    try {
      const response = await axiosInstance.post('/otp-submit', { otp });
      if (response.status === 201) {
        toast.success(response.data);
        navigate('/login');
      }else if(response.status === 200){
        setEmail(response.data.email)
        navigate('/new-password',{state:{email:email}})
      }
    } catch (error) {
      toast.error(error.response?.data || 'Verification failed');
      console.error('verifyOtp error:', error);
    }
  };
  
  const handleResendOtp = async () => {
    if (isActive) {
      toast.warning('Please wait for timer to expire');
      return;
    }

    try {
      const response = await axiosInstance.get('/resend-otp');
      if (response.status === 200) {
        // Reset timer and states
        setTimeLeft(120);
        setIsActive(true);
        toast.success('OTP resent successfully');
      }
    } catch (error) {
      toast.error(error.response?.data || 'Failed to resend OTP');
      console.error('resendOtp error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>
      
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label 
            htmlFor="otp" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your OTP"
          />
        </div>

        {/* Timer Display */}
        <div className="bg-gray-700 text-white p-4 rounded-md text-center">
          <p className="text-sm font-medium mb-1">Time Remaining</p>
          <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={!isActive}
          onClick={handleVerify}
          className={`w-full py-3 px-4 rounded-md text-white font-medium
            ${isActive 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'
            } transition duration-150 ease-in-out`}
        >
          Verify OTP
        </button>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isActive}
          className={`w-full py-3 px-4 rounded-md text-white font-medium
            ${!isActive 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
            } transition duration-150 ease-in-out`}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;