import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";

const ProtectionLayout = ({ children }) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get("/admin/verify-token");
        if (response.status === 200) {
          setVerified(true); // Allow rendering of children
        } else {
          navigate("/adminlogin");
        }
      } catch (error) {
        console.log("Token verification failed:", error);
        navigate("/adminlogin");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [navigate]);

  // Show loading spinner until verification is complete
  if (loading) {
    return <div>Loading...</div>; // Or use a proper loading spinner
  }

  // Render children only if verified
  return verified ? <>{children}</> : null;
};

export default ProtectionLayout;
