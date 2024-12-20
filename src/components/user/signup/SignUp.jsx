import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const SignUp = () => {
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
        newErrors.FirstName = "Name is required";
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
    } else if (!/^[\w-.]+@gmail\.com$/.test(trimmedEmail)) {
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
      console.log(email);
      const response = await axios.post(
        "http://localhost:3000/signup",
        userDetails
      );
      if (response.data.googleId) {
        Navigate("/home");
      } else {
        Navigate("/login");
      }
      response.data;
    } catch (error) {
      console.log("google signup", error);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Signup</h1>
      <p className="signup-subtitle">
        Already Have An Account?{" "}
        <Link to="/login" className="login-link">
          Login
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            name="firstName"
            placeholder="First Name"
            className="form-input"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            name="lastName"
            placeholder="Last Name"
            className="form-input"
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            name="email"
            placeholder="Email"
            className="form-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            name="phone"
            placeholder="Phone Number"
            className="form-input"
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            className="form-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.cofirmPassword && <span className="error">{errors.cofirmPassword}</span>}
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              name="terms"
              value="agree"
              className="checkbox-input"
            />
            I have read and agreed to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button type="submit" className="signup-button">
          Create Account
        </button>

        <hr className="divider" />

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded.sub);
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
              saveUserDetails(userDetails);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </form>
    </div>
  );
};

export default SignUp;
