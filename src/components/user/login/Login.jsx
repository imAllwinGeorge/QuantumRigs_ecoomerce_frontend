import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/userSlice";

const Login = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors,setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if(!email){
      newErrors.email =  'email cannot be empty'
    }
    if(!password){
      newErrors.password = 'password cannot be empty'
    }
    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
     console.log('login page details',response)
      if (response.data.email) {
        dispatch(addUser(response.data))
        setTimeout(() => {
          Navigate("/home");
        }, 200);
      } else if (response.data) {
        console.log(response.data);
      }
    } catch (error) {
      console.log("invalid credentials", error);
    //   console.log(error.response.data);
      toast(error.response.data);
    }
  };

  const userLogin = async (googleId) => {
    try {
      console.log(googleId);
      const response = await axiosInstance.post("/login", { googleId });
      console.log(response.data);
      if (response.data.id) {
        Navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast(error.response.data)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 "style={{
      backgroundImage: 'url("/background/esthetic_rig_setup_for-review.jpg")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh', // Full viewport height
      width: '100%',  // Full width of the container
    }}>
      <div className="max-w-md w-full space-y-8 bg-black bg-opacity-50 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="mt-2 text-sm text-white">
            Don't have an account?
            <Link
             to="/signup"
              className="font-medium  text-amber-500 hover:text-primary/90 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white "
              >
                Email or Phone
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 bg-gray-300 text-black py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your email or phone"
                />
                {errors.email&&<span className="text-red-700" >{errors.email}</span>}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white "
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full text-black px-3 py-2.5 bg-gray-300 border border-gray-300 rounded-lg shadow-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                {errors.password&&<span className="text-red-700" >{errors.password}</span>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black  bg-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
            >
              Login
            </button>
          </div>
          <div className=" text-right hover:text-red-600 ">
            <a href="/verify-email">Forgotten Password? </a>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2  text-white font-bold">OR</span>
            </div>
          </div>

          <div className="mt-6 ">
            <div className="w-full grid-cols-2 justify-center flex">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  userLogin(decoded.sub);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                theme="outline"
                shape="rectangular"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default Login;
