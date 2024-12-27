import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/Axios';
import { toast } from 'react-toastify';



const Login = () => {
    const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async(event) => {
    event.preventDefault();
    // Handle form submission
    //validation

    try {
       const response = await axiosInstance.post('/login',{
        email,
        password
       })  
       console.log(response)
       if(response.data.email){
        Navigate('/home')
       }else if (response.data){
        console.log(response.data)
       }
    } catch (error) {
        console.log('invalid credentials',error)
        console.log(error.response.data)
        toast(error.response.data)
    }
    
  };

  const userLogin = async (googleId)=>{
    try {
        console.log(googleId)
        const response = await axiosInstance.post('/login',{googleId})
        console.log(response.data)
        if(response.data.user){
            Navigate('/home')
        }
    } catch (error) {
        console.log(error)
    }
  }

 

  return (
    <div className="signup-container">
      <h1 className="signup-title">Login</h1>
      <p className="signup-subtitle">
        Already Have An Account? <Link to="/signup" className="login-link">SignUP</Link>
      </p>
      <form onSubmit={handleSubmit} className="signup-form">

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            name="email"
            placeholder="Email"
            className="form-input"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            className="form-input"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        <button type="submit" className="signup-button">Login</button>

        <hr className="divider" />

        <GoogleLogin
            onSuccess={credentialResponse => {
            const decoded = jwtDecode(credentialResponse.credential)
            userLogin(decoded.sub)
            }}
            onError={() => {
            console.log('Login Failed');
            }}
        />
      </form>
    </div>
  );

}

export default Login