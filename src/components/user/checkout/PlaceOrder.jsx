import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const details = useSelector((state) => state.user);
  console.log(details, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
  const price = details?.cart?.price;
  const discount = details?.cart?.discount;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState({});
  const [triggerFetch, setTriggerFetch] = useState(false);

  const validation = () => {
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    const trimmedPincode = pincode.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();

    if (!trimmedName) {
      newErrors.name = "name field cannot be empty";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      newErrors.name = "Name can only contain letters";
    }
    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits and start with 6, 7, 8, or 9";
    } else if (/^(\d)\1{9}$/.test(phone)) {
      newErrors.phone = "Phone number cannot have all digits the same";
    }
    if (!trimmedAddress) {
      newErrors.address = "address cannot be empty";
    }
    if (!trimmedPincode) {
      newErrors.pincode = "pincode needed";
    }
    if (!trimmedCity) {
      newErrors.city = "city needed";
    }
    if (!trimmedState) {
      newErrors.state = "state must needed";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValidation = validation();

    if (Object.keys(formValidation).length > 0) {
      setError(formValidation);
      return;
    }

    try {
      const response = await axiosInstance.post("/add-address", {
        name,
        phone,
        address,
        pincode,
        city,
        state,
        userId: details?.users?.id,
      });
      if (response.status === 201) {
        setTriggerFetch((prev) => !prev);
        toast(response.data);
        setName("");
        setAddress("");
        setPhone("");
        setPincode("");
        setCity("");
        setState("");
        setError({})
      }
    } catch (error) {
      console.log("adress management ", error.message);
      toast(error.response.data);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstance.get(
          `/get-address/${details?.users?.id}`
        );
        if (response.status === 200) {
          console.log(response.data);
          setAddresses(response.data);
        }
      } catch (error) {
        console.log("fetch Addrss details", error.message);
        toast(error.response.data);
      }
    };
    fetchAddress();
  }, [navigate, triggerFetch]);
  return (
  
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Select Address</h1>
      <div className="space-y-6">
        {addresses &&
          addresses.map((addr) => (
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAddress === addr._id
                  ? "bg-blue-100 border-amber-500"
                  : "bg-white border-gray-200 hover:border-amber-300"
              }`}
              key={addr._id}
              onClick={() => {
                setSelectedAddress(addr._id);
                console.log(addr._id);
              }}
            >
              <h1 className="text-xl font-bold text-gray-800">{addr.name}</h1>
              <h1 className="text-lg font-semibold text-gray-700">{addr.phone}</h1>
              <p className="text-gray-600">{addr.address}</p>
              <p className="text-gray-600">{addr.city}</p>
              <p className="text-gray-600">{addr.state}</p>
              <button
                className="mt-4 font-bold bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
                onClick={() =>
                  navigate("/payment", { state: { address: addr } })
                }
              >
                Deliver Here
              </button>
            </div>
          ))}

        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Add Address
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
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                id="address"
                name="address"
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                Pincode
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                value={pincode}
                placeholder="Pincode"
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {error.state && (
                <span className="text-red-500 text-sm">{error.state}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              Add address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
