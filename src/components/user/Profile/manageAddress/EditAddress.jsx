import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axiosInstance from '../../../../api/Axios';

const EditAddress = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {addr } = location.state;

    const [name,setName] = useState(addr.name);
    const [phone,setPhone] = useState(addr.phone);
    const [address,setAddress] = useState(addr.address);
    const [pincode,setPincode] = useState(addr.pincode);
    const [city,setCity] = useState(addr.city);
    const [state,setState] = useState(addr.state);
    const [error, setError] = useState({});

    const validateForm = ()=>{
        const newErrors = {};
        if (!name) {
          newErrors.name = "name field cannot be empty";
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
          newErrors.name = "Name can only contain letters";
        }
        if (!phone) {
          newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
          newErrors.phone = "Phone number must be 10 digits and start with 6, 7, 8, or 9";
        } else if (/^(\d)\1{9}$/.test(phone)) {
          newErrors.phone = "Phone number cannot have all digits the same";
        }
        if(!address){
            newErrors.address = 'address cannot be empty'
        }
        if(!pincode){
            newErrors.pincode = 'pincode cannot be empty'
        }
        if(!city){
            newErrors.city = 'city cannot be empty'
        }
        if(!state){
            newErrors.state = 'state cannot be empty'
        }
        return newErrors
    }

    const handleSubmit = async(event)=>{
        event.preventDefault();

        const validationError = validateForm();

        if(Object.keys(validationError).length > 0){
            setError(validationError);
            return;
        }

        try {
            const response = await axiosInstance.put('/edit-address',{name,phone,address,pincode,city,state,_id:addr._id});
            console.log(response)
            if(response.status === 200){
                toast(response.data.message)
                navigate(-1)
            }
        } catch (error) {
            console.log('editAddresspage',error.message);
            toast(error.response.data)
        }

    }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
    <h2 className="text-black text-2xl font-semibold text-center mb-6">
      Edit Address
    </h2>
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.name && (
          <span className="text-red-500 text-sm">{error.name}</span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.phone && (
          <span className="text-red-500 text-sm">{error.phone}</span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <textarea
          type="text"
          id="address"
          name="address"
          value={address}
          placeholder="address"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.address && (
          <span className="text-red-500 text-sm">{error.address}</span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="pincode"
          className="block text-sm font-medium text-gray-700"
        >
          pincode
        </label>
        <input
          type="number"
          id="pincode"
          name="pincode"
          value={pincode}
          placeholder="pincode"
          onChange={(e) => setPincode(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.pincode && (
          <span className="text-red-500 text-sm">{error.pincode}</span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.city && (
          <span className="text-red-500 text-sm">{error.city}</span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={state}
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {error.state && (
          <span className="text-red-500 text-sm">{error.state}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Edit address
      </button>
    </form>
  </div>
  )
}

export default EditAddress