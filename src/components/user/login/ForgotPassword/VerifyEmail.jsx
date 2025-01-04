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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" >Verify</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
