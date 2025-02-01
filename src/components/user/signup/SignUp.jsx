import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../api/Axios";
import VerifyOtp from "./VerifyOtp";
import { toast } from "react-toastify";


const SignUp = () => {
 
  // console.log("zzzzzzzzzzzzzzzzz",conf)
  const Navigate = useNavigate();
  //   const [userName,setUserName] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //   const [googleId,setGoogleId] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = ()=>{
    const newErrors = {};

    const  trimmedFirstName =  firstName.trim();
    const  trimmedLastName =  lastName.trim();
    const  trimmedEmail =  email.trim();
    const  trimmedPhone =  phone.trim();
    if(password !== confirmPassword){
      newErrors.cofirmPassword = "password should be same"
    }
    const trimmedPassword = password.trim();

    if(!trimmedFirstName){
        newErrors.firstName = "Name is required";
    }else if(!/^[A-Za-z\s]+$/.test(trimmedFirstName)){
        newErrors.firstName = "Name can only contain letters"
    }

    if(!trimmedLastName){
      newErrors.lastName = "Name is required";
  }else if(!/^[A-Za-z\s]+$/.test(trimmedLastName)){
      newErrors.lastName = "Name can only contain letters"
  }

    if (!trimmedEmail) {
        newErrors.email = "Email is required.";
    } else if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
        newErrors.email = "Email must be a valid Gmail address.";
    }

    if (!trimmedPhone) {
        newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(trimmedPhone)) {
        newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if(!trimmedPassword){
        newErrors.password = "Password should not be empty."
    }else if(password.length < 6){
        newErrors.password = "Password shold contain atleast 6 digits"
    }
    
    return newErrors;

}



  const handleSubmit = (event) => {
    event.preventDefault();

    //validation
    const validationErrors = validateForm()
if(Object.keys(validationErrors).length > 0){
    setErrors(validationErrors);
    return;
}

    try {
      const userDetails = {
        firstName,
        lastName,
        email,
        password,
        phone,
      };
      saveUserDetails(userDetails);
    } catch (error) {
      console.log(error);
    }
  };
  const saveUserDetails = async (userDetails) => {
    console.log("hello");
    try {
      
      const response = await axiosInstance.post(
        "/signup",
        userDetails
      );
     if(response.status === 200 ){
        console.log(response)
        Navigate('/verify-otp')
      }
      
    } catch (error) {
      console.log("google signup", error);
      toast(error.response.data)
    }
  };

  const googleSignUp = async(userDetails)=>{
    try {
      const response = await axiosInstance.post('/gooogle-signup',userDetails)
      console.log(response)
      if(response.status === 201 || response.status === 200){
        toast(response.message)
        Navigate('/home')
      }
    } catch (error) {
      toast(error.response.data)
      console.log('google signup',error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">Signup</h1>
        <p className="text-gray-400 mb-8">
          Already Have An Account?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-sm font-bold text-black mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              name="firstName"
              placeholder="First Name"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}

          <div className="form-group">
            <label htmlFor="lastName" className="block text-sm font-bold text-black mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              name="lastName"
              placeholder="Last Name"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-bold text-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              name="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="block text-sm font-bold text-black mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              name="phone"
              placeholder="Phone Number"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-bold text-black mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-black mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md text-black placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.cofirmPassword && <span className="text-red-500 text-sm">{errors.cofirmPassword}</span>}
          </div>

          <div className="form-group">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="terms"
                value="agree"
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-400">
                I have read and agreed to the Terms of Service and Privacy Policy
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-md
              transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Create Account
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900 px-4 text-sm text-gray-400">or</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);
              console.log(decoded);
              if (
                decoded.sub &&
                decoded.given_name &&
                decoded.family_name &&
                decoded.email &&
                decoded.name
              ) {
                const userDetails = {
                  firstName: decoded.given_name,
                  lastName: decoded.family_name,
                  userName: decoded.name,
                  email: decoded.email,
                  googleId: decoded.sub,
                };
                googleSignUp(userDetails);
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </form>
      </div>
    </div>
    
    {/* Image Section */}
    <div className="hidden lg:block relative flex-1">
      <img
        src="/background/amr-taha-umixjcVd0Ws-unsplash.jpg"
        alt="Workspace setup"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </div>
  );
};

export default SignUp;
