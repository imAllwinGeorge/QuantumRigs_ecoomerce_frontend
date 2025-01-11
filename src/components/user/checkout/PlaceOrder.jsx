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
      newErrors.phone = "phone number needed";
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
    <div>
      <h1 className="text-black font-bold">Select Address</h1>
      <div>
        {addresses &&
          addresses.map((addr) => (
            <div
              className={`mb-2 py-4 border rounded-lg text-center cursor-pointer ${
                selectedAddress === addr._id
                  ? "bg-blue-200 border-blue-600"
                  : "bg-gray-200 border-neutral-600"
              }`}
              key={addr._id}
              onClick={() => {
                setSelectedAddress(addr._id);
                console.log(addr._id);
              }}
            >
              <h1 className=" text-black font-bold ">{addr.name}</h1>
              <h1 className=" text-black font-semibold">{addr.phone}</h1>
              <p className=" text-black ">{addr.address}</p>
              <p className=" text-black ">{addr.city}</p>
              <p className=" text-black ">{addr.state}</p>
              <button
                className="bg-orange-600 text-white"
                onClick={() =>
                  navigate("/payment", { state: { address: addr } })
                }
              >
                proceed to pay
              </button>
            </div>
          ))}

        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-black text-2xl font-semibold text-center mb-6">
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
              Add address
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default PlaceOrder;
