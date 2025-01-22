import { CreditCard, Truck, Wallet } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import {productOrdered} from "../../../redux/userSlice"

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { address } = location.state;
  console.log(address);
  const details = useSelector((state) => state.user);
  console.log(details, "qwertyusdfghjxcvbn");
  const Razorpay = useRazorpay();
  const paymentMethods = [
    {
      id: "online",
      name: "online",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: "cash-on-delivery",
      name: "Cash on Delivery",
      icon: <Truck className="w-6 h-6" />,
    },
    { id: "wallet", name: "E-Wallet", icon: <Wallet className="w-6 h-6" /> },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedOption === "cash-on-delivery") {
        const response = await axiosInstance.post("/order-product", {
          userId: details?.users?.id,
          paymentMethod: "COD",
          totalAmount: details?.cart?.price[1] - details?.cart?.discount,
          shippingAddress: {
            name: address?.name,
            address: address?.address,
            city: address?.city,
            pincode: address?.pincode,
            phone: address?.phone,
          },
          couponDetails:details?.cart?.appliedCoupon,
          discount:details?.cart?.discount,
          originalAmount:details?.cart?.price[0],
          items: details?.cart?.productInfo.map((item) => {
            return {
              productId: item?.product?._id,
              variantId: item?.variant?._id,
              quantity: item?.quantity,
            };
          }),
        });
        if (response.status === 200) {
          console.log("ordersuccess");
          toast("order placed successfully");
          dispatch(productOrdered());
          navigate('/home');
        }
      }else if(selectedOption === 'online'){
        try {
          setLoading(true);
    
          // Create order on the backend
          const { data } = await axiosInstance.post("/api/payment/create-order", {
            amount: details?.cart?.price[1] - details?.cart?.discount, // Example amount in INR
            currency: "INR",
            receipt: details?.users?.id,
          });
    
          const options = {
            key: "rzp_test_YSUyXhKfvmy5Tq", // Enter the Key ID generated from Razorpay Dashboard
            amount: data.order.amount,
            currency: data.order.currency,
            name: "Quantum_Rigs",
            description: "Test Transaction",
            order_id: data.order.id, // Order ID returned from Razorpay
            prefill: {
              name: details?.users?.name,
              email: details?.users?.email,
              contact: details?.users?.phone,
            },
            handler: async function (response) {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
    
              // Verify payment on the backend
              const verifyResponse = await axiosInstance.post("/api/payment/verify-payment", paymentData);
    
              if (verifyResponse.data.success) {
                try {
                  const response = await axiosInstance.post("/order-product", {
                    userId: details?.users?.id,
                    paymentMethod: "online",
                    totalAmount: details?.cart?.price[1] - details?.cart?.discount,
                    shippingAddress: {
                      name: address?.name,
                      address: address?.address,
                      city: address?.city,
                      pincode: address?.pincode,
                      phone: address?.phone,
                    },
                    couponDetails:details?.cart?.appliedCoupon,
                    discount:details?.cart?.discount,
                    originalAmount:details?.cart?.price[0],
                    items: details?.cart?.productInfo.map((item) => {
                      return {
                        productId: item?.product?._id,
                        variantId: item?.variant?._id,
                        quantity: item?.quantity,
                      };
                    }),
                  });
                  if (response.status === 200) {
                    console.log("ordersuccess");
                    toast("order placed successfully");
                    dispatch(productOrdered());
                    // console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
                    // window.close();
                    // console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
                    navigate('/home')
                  }
                } catch (error) {
                  console.log('online order saving',error.message);
                  toast(error?.response?.data?.message)
                } 
                // alert("Payment Successful!");
              } else {
                toast("Payment verification failed.");
              }
            },
            theme: {
              color: "#3399cc",
            },
          };
    
          if (typeof window.Razorpay !== "undefined") {
            const paymentObject = new window.Razorpay(options);
            

            paymentObject.open();
          } else {
            console.error("Razorpay SDK is not loaded.");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error initiating payment:", error);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log("handle payment option", error.message);
      toast(error.response);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Choose Payment Option
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === method.id
                  ? "bg-blue-50 border-amber-500"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentOption"
                value={method.id}
                checked={selectedOption === method.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className="text-amber-500 mr-3">{method.icon}</div>
                <div>
                  <p className="font-medium text-gray-700">{method.name}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
        >
          {loading?"processing":'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default Payment;
