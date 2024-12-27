import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async(e) => {
    e.preventDefault();
    // Handle OTP submission logic here
    const response = await axiosInstance.post('/otp=submit',{otp})
  };

  const resendOtp = () => {
    // Handle OTP verification logic here
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">OTP Verification</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify OTP
        </button>
        <div className="bg-black text-white p-4 rounded-md text-center">
          <p className="text-lg font-semibold">Time Remaining</p>
          <p className="text-3xl font-bold">{formatTime(timeLeft)}</p>
        </div>
        <button
          type="button"
          onClick={resendOtp}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;

