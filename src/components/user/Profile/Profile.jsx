import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";

const Profile = () => {
  const user = useSelector((state) => state.user.users);
  console.log("profile user",user);
  const [userDetails, setUserDetails] = useState({});
  const [firstName, setFirstName] = useState(userDetails.firstName || "");
  const [lastName, setLastName] = useState(userDetails.lastName  || "");
  const [phone, setPhone] = useState(userDetails.phone || 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!firstName) {
      newErrors.firstName = "first name cannot be empty";
    }
    if (!lastName) {
      newErrors.lastName = "last name cannot be empty";
    }
    if (!phone) {
      newErrors.phone = "phone number cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axiosInstance.put("/user-edit", {
        _id: userDetails._id,
        email: userDetails.email,
        firstName,
        lastName,
        phone,
      });
      console.log(response)
      if(response.status === 200){
        toast(response.message)
        setUserDetails(response?.data?.updatedUser)
        setFirstName(response?.data?.updatedUser?.firstName);
        setLastName(response?.data?.updatedUser?.lastName);
        setPhone(response?.data?.updatedUser?.phone);
        toast(response.data.message)
      }
    } catch (error) {
      console.log("handlesubmit profile page", error.message);
      toast(error.response.data);
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/fetch_user/${user.id}`);
        console.log(response);
        if (response.status === 200) {
         setUserDetails(response.data)
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setPhone(response.data.phone);
          
        }
      } catch (error) {
        console.log("profile page fetch user", error.message);
        toast(error.response.data);
      }
    };
    fetchUserDetails();
  }, [user]);
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-black p-6 md:p-8">
        <div className="mb-8">
          <span className="text-gray-600 text-sm">Hello,</span>
          <h1 className="text-2xl font-semibold text-gray-900">{userDetails.firstName}</h1>
        </div>

        <div className="mb-6">
          <h2 className=" text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button 
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Edit Details
            </button>
          </form>
        </div>
        <div>
          <h1 className="text-black">Reffer And Earn</h1>
          <h3 className="text-gray-600"> Refferal Code : {" "}<span>{user.id}</span></h3>
        </div>
      </div>
    </div>
  );
};

export default Profile;
