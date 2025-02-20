import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useRazorpay } from "react-razorpay";

const AddMoney = ({ user, onClose }) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const Razorpay = useRazorpay();

  const addWalletTransaction = async () => {
    try {
      const response = await axiosInstance.post("/wallet/add-money", {
        amount,
        userId: user.id,
      });
      if (response.status === 200) {
        onClose();
        toast(response?.data?.message);
      }
    } catch (error) {
      console.log("add wallet transaction", error);
      toast(error?.response?.data?.message);
    }
  };

  const addMoney = async () => {
    try {
      console.log("ordersuccess");
      const { data } = await axiosInstance.post("/api/payment/create-order", {
        amount: amount,
        currency: "INR",
        receipt: user.id,
      });

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Quantum_Rigs",
        description: "Test Transaction",
        order_id: data.order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        handler: async (response) => {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyResponse = await axiosInstance.post(
            "/api/payment/verify-payment",
            paymentData
          );

          if (verifyResponse.data.success) {
            console.log("ordersuccess", verifyResponse);
            addWalletTransaction();
          } else {
            console.log("online payment failed");
            toast("Payment verification failed.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          console.log("payment error", response.error.description);
          // navigate("/error-payment", {
          //   state: { orderDetails: orderedProduct },
          // });
        });
        paymentObject.open();
      } else {
        console.error("Razorpay SDK is not loaded.");
        toast("Payment gateway is not available. Please try again later.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast("Error initiating payment. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure amount is a string for validation
    const amountStr = amount.toString().trim();

    // Check if the input is empty
    if (!amountStr) {
      setError("This field cannot be empty");
      return;
    }

    // Check if the input is a valid number
    const amountNum = Number(amountStr);
    if (isNaN(amountNum)) {
      setError("Please enter a valid number");
      return;
    }

    // Check if the number is within the desired range
    if (amountStr.length < 2 || amountStr.length > 5) {
      setError("Amount must be between 2 to 4 digits");
      return;
    }

    // If all validations pass, clear the error
    setError("");

    addMoney();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Money</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="Enter Amount"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Add Money
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMoney;
