import React, { useState } from "react";
import axiosInstance from "../../../../api/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');

    const handleSubmit = async(event)=>{
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/verify-email',{email});
            console.log(response)
            if(response.status === 200){
                
                navigate('/verify-otp')
            }
        } catch (error) {
            console.log(error.message,"forgot password emailvarification")
            toast(error.response.data)
        }
    }
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Verify
        </button>
      </form>
    </div>
  </div>
  );
};

export default VerifyEmail;
