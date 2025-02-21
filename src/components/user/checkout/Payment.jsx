import { CreditCard, Truck, Wallet } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { productOrdered } from "../../../redux/userSlice";

const Payment = () => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
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
  const paymentMethods =
    details?.cart?.price[1] - details?.cart?.discount + details?.cart?.deliveryCharge < 10000
      ? [
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
          {
            id: "wallet",
            name: "E-Wallet",
            icon: <Wallet className="w-6 h-6" />,
          },
        ]
      : [
          {
            id: "online",
            name: "online",
            icon: <CreditCard className="w-6 h-6" />,
          },
          {
            id: "wallet",
            name: "E-Wallet",
            icon: <Wallet className="w-6 h-6" />,
          },
        ];

  const changePaymentStatus = async (orderId) => {
    try {
      const response = await axiosInstance.patch(
        `/change-payment-status/${orderId}`
      );
      if (response.status === 200) {
        console.log("paymentDone");
      }
    } catch (error) {
      console.log("change payment status", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try {
    if (selectedOption === "cash-on-delivery") {
      try {
        const response = await axiosInstance.post("/order-product", {
          userId: details?.users?.id,
          paymentMethod: "COD",
          paymentStatus: "pending",
          totalAmount: details?.cart?.price[1] - details?.cart?.discount + details?.cart?.deliveryCharge,
          shippingAddress: {
            name: address?.name,
            address: address?.address,
            city: address?.city,
            pincode: address?.pincode,
            phone: address?.phone,
          },
          couponDetails: details?.cart?.appliedCoupon,
          discount: details?.cart?.discount,
          deliveryCharge: details?.cart?.deliveryCharge,
          originalAmount: details?.cart?.price[0],
          items: details?.cart?.productInfo.map((item) => {
            return {
              productId: item?.product?._id,
              variantId: item?.variant?._id,
              quantity: item?.quantity,
              price: item?.variant?.salePrice * item?.quantity,
            };
          }),
        });
        if (response.status === 200) {
          console.log(
            "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjyyyyyyyyyyyyyyyy",
            response.data
          );
          toast("order placed successfully");
          dispatch(productOrdered());
          navigate("/order-summery", {
            state: { orderDetails: response?.data?.orderedProducts },
          });
        }
      } catch (error) {
        console.log("order creating error occured", error);
        toast(error.response.data);
        navigate("/cart");
      }
    } else if (selectedOption === "online") {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/order-product", {
          userId: details?.users?.id,
          paymentMethod: "online",
          paymentStatus: "pending",
          totalAmount: details?.cart?.price[1] - details?.cart?.discount + details?.cart?.deliveryCharge,
          shippingAddress: {
            name: address?.name,
            address: address?.address,
            city: address?.city,
            pincode: address?.pincode,
            phone: address?.phone,
          },
          couponDetails: details?.cart?.appliedCoupon,
          discount: details?.cart?.discount,
          deliveryCharge: details?.cart?.deliveryCharge,
          originalAmount: details?.cart?.price[0],
          items: details?.cart?.productInfo.map((item) => ({
            productId: item?.product?._id,
            variantId: item?.variant?._id,
            quantity: item?.quantity,
            price: item?.variant?.salePrice * item?.quantity
          })),
        });

        if (response.status === 200) {
          console.log("jhdkfioehifnjkshfuioh", response?.data?.orderedProducts);
          const orderedProduct = response?.data?.orderedProducts;
          try {
            console.log("ordersuccess");
            const { data } = await axiosInstance.post(
              "/api/payment/create-order",
              {
                amount: details?.cart?.price[1] - details?.cart?.discount + details?.cart?.deliveryCharge,
                currency: "INR",
                receipt: details?.users?.id,
              }
            );

            console.log("order checking",data)

            const options = {
              key: razorpayKey,
              amount: data.order.amount,
              currency: data.order.currency,
              name: "Quantum_Rigs",
              description: "Test Transaction",
              order_id: data.order.id,
              prefill: {
                name: details?.users?.name,
                email: details?.users?.email,
                contact: details?.users?.phone,
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
                  toast(response?.data?.message);
                  dispatch(productOrdered());

                  changePaymentStatus(orderedProduct._id);
                  navigate("/order-summery", {
                    state: { orderDetails: orderedProduct },
                  });
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
                navigate("/error-payment", {
                  state: { orderDetails: orderedProduct },
                });
                
              });
              paymentObject.open();
            } else {
              console.error("Razorpay SDK is not loaded.");
              toast(
                "Payment gateway is not available. Please try again later."
              );
            }
          } catch (error) {
            console.error("Error initiating payment:", error);
            toast("Error initiating payment. Please try again.");
          }
        }
      } catch (error) {
        console.log("online order saving", error);
        toast(
          error?.response?.data?.message ||
            "Error processing order. Please try again."
        );
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    } else if (selectedOption === "wallet") {
      try {
        const response = await axiosInstance.post("/order-product", {
          userId: details?.users?.id,
          paymentMethod: "wallet",
          paymentStatus: "paid",
          totalAmount: details?.cart?.price[1] - details?.cart?.discount + details?.cart?.deliveryCharge,
          shippingAddress: {
            name: address?.name,
            address: address?.address,
            city: address?.city,
            pincode: address?.pincode,
            phone: address?.phone,
          },
          couponDetails: details?.cart?.appliedCoupon,
          discount: details?.cart?.discount,
          deliveryCharge: details?.cart?.deliveryCharge,
          originalAmount: details?.cart?.price[0],
          items: details?.cart?.productInfo.map((item) => {
            return {
              productId: item?.product?._id,
              variantId: item?.variant?._id,
              quantity: item?.quantity,
              price: item?.variant?.salePrice * item?.quantity
            };
          }),
        });
        if (response.status === 200) {
          console.log(
            "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjyyyyyyyyyyyyyyyy",
            response.data
          );
          toast("order placed successfully");
          dispatch(productOrdered());
          navigate("/order-summery", {
            state: { orderDetails: response?.data?.orderedProducts },
          });
        }
      } catch (error) {
        console.log("order creating error occured", error);
        
        navigate("/wallet");
        toast(error?.response?.data?.message || "Ooops! something went wrong, please check your wallet");
      }
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
          {loading ? "processing" : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default Payment;
