import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { productOrdered } from "../../../redux/userSlice";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../api/Axios";

const OrderSummery = () => {
  const imageUrl = import.meta.env.VITE_IMG_URL;
  const location = useLocation();
  const dispatch = useDispatch();
  const { orderDetails } = location.state;
  console.log('suduuuuuuuuuuuuuuu',location.state);
  useEffect(()=>{
    const quantityManagement = async(orderDetails)=>{
      try {
        const response = await axiosInstance.put("/quantity-management",{orderDetails})
        console.log("quantity managment",response);
        if(response.status === 200){
          console.log('quantityManaged')
        }
      } catch (error) {
        console.log("order management",error);
      }
    }
    quantityManagement(orderDetails);

  },[orderDetails])
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Placed Successfully</h1>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Order Id: <span className="text-indigo-600">{orderDetails._id}</span>
        </h2>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Billing Address</h2>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          {Object.entries(orderDetails.shippingAddress).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center mb-2 text-gray-700">
              <span className="font-medium capitalize">{key}:</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {orderDetails.items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <img
                src={`${imageUrl}${item?.productId?.images[0]}`}
                alt={item?.productId?.productName}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item?.productId?.productName}</h3>
                <p className="text-gray-600">
                  Brand: <span className="font-medium">{item?.productId?.brandId?.brand}</span>
                </p>
                <p className="text-gray-600">
                  Sub Category: <span className="font-medium">{item?.productId?.subCategorId?.subCategory}</span>
                </p>
                <p className="text-gray-600">
                  Quantity: <span className="font-medium">{item?.quantity}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-3">
        <div className="flex justify-between items-center text-gray-700">
          <span>Payment Method:</span>
          <span className="font-medium">{orderDetails?.paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Total:</span>
          <span className="font-medium">₹{orderDetails?.originalAmount}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Offer Price:</span>
          <span className="font-medium">₹{(orderDetails?.totalAmount + orderDetails?.discount - orderDetails?.deliveryCharge).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Coupon Discount:</span>
          <span className="font-medium text-green-500">-₹{orderDetails?.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Delivery Charge:</span>
          <span className="font-medium text-gray-700">₹{orderDetails?.deliveryCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Payable Amount:</span>
          <span className="font-medium">₹{orderDetails?.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg text-white">
        <div className="flex justify-between items-center text-xl">
          <span className="font-semibold">Grand Total:</span>
          <span className="text-2xl font-bold">₹{orderDetails?.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="my-6 grid ">
      <Link to='/home' className="bg-green-500 py-3 px-5 rounded-lg text-center font-bold" >go home</Link>
      <Link to='/shop' className="bg-red-500 py-3 px-5 rounded-lg text-center font-bold my-6" >shop now</Link>
      </div>
    </div>
  );
};

export default OrderSummery;
