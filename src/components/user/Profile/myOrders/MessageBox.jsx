import React, { useState } from "react";
import axiosInstance from "../../../../api/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MessageBox = ({ orderDetails, identifier, onClose}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error,setError] = useState(null)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage =  message.trim();
    if(trimmedMessage === ''){
      setError("this field cannot be empty, please enter the reason");
      return;
    }
    
    orderDetails.message = message;
    
    if (identifier) {
      try {
        
        const response = await axiosInstance.patch(
          `/cancel-product`,
          orderDetails
        );
        if (response.status === 200) {
          toast(response?.data?.message);
          onClose();
        }
      } catch (error) {
        console.log("cancel product", error.message);
        toast(error?.response?.data);
      }
    } else {
      try {
        // console.log(
        //   orderId,
        //   productOrderId,
        //   paymentMethod,
        //   productId,
        //   variantId,
        //   quantity
        // );
        console.log(orderDetails)
        const response = await axiosInstance.post("/return-product", 
          orderDetails
        );
        if (response.status === 200) {
          // setTriggerFetch((state) => !state);
          toast(response.data.message);
          onClose();

        }
      } catch (error) {
        console.log("return product", error);
      }
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">{identifier ? "Cancel Order" : "Return Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide a reason..."
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
          />
          {error&&<span className="text-red-500">{error}</span>}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default MessageBox;
