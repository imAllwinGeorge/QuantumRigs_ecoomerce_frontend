import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";

const UserHomeProtection = ({ children }) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get("/verify-token");
        console.log(response)
        if (response.status === 200) {
          setVerified(true);
          navigate("/home");
        }
      } catch (error) {
        console.log("Token verification failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <div>{!verified && children}</div>;
};

export default UserHomeProtection;
