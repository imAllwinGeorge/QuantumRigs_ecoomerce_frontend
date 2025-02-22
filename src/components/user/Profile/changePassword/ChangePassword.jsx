import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/Axios";
import { useSelector } from "react-redux";

const ChangePassword = () => {
    const user = useSelector(state=>state.user.users)
    console.log(user.id)
    const[oldPassword,setOldPassword] = useState('');
    const[newPassword,setNewPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
    const[error,setError] = useState({})


    const handleSubmit = async(event)=>{
        event.preventDefault();
        const trimmedPassword = newPassword.trim();
        const newErrors = {};
        if(!oldPassword){
            newErrors.oldPassword = 'old password should be inputed'
        }
        if (!trimmedPassword) {
          newErrors.newPassword = "Password should not be empty.";
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            newPassword
          )
        ) {
          newErrors.newPassword =
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
        }
      
        if(newPassword !== confirmPassword){
            newErrors.missMatchPassword = 'new password and confirm password miss match'
        } else if( oldPassword === newPassword){
          newErrors.missMatchPassword = "old password and new password cannot be same"
        }

        if(Object.keys(newErrors).length > 0){
            setError(newErrors);
            return;
        }
        try {
            const response = await axiosInstance.put('/reset-password',{oldPassword,newPassword,_id:user.id});
            console.log(response)
            if(response.status === 200){
                toast(response.data)
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError({})
            }
        } catch (error) {
            console.log('resetPassword',error.message)
            toast(error.response.data)
        }
    }
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h2 className="text-black text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            id="old-password"
            name="old-password"
            value={oldPassword}
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error.oldPassword && <span className="text-red-500 text-sm">{error.oldPassword}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            value={newPassword}
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error.newPassword && <span className="text-red-500 text-sm">{error.newPassword}</span>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error.confirmPassword && <span className="text-red-500 text-sm">{error.confirmPassword}</span>}
          <br />
          {error.missMatchPassword && <span className="text-red-500 text-sm">{error.missMatchPassword}</span>}
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset Password
        </button>
      </form>
    </div>
  </div>
  );
};

export default ChangePassword;
