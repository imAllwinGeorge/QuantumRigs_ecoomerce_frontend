import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectionLayout = ({ children }) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get("/admin/verify-token");
        if (response.status === 200) {
          setVerified(true);
          navigate("/adminhome");
        }
      } catch (error) {
        console.log("Token verification failed:", error);
        navigate("/adminlogin");
        toast(error?.response?.message)
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

export default ProtectionLayout;
