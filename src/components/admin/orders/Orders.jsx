import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";

import Swal from 'sweetalert2';

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [newStatus, setNewStatus] = useState({
    status:'',
    orderId:"",
    productOrderId:""
  });
  // const [swalProps, setSwalProps] = useState({});


  const handleChange = (status,orderId,productOrderId)=>{
    setNewStatus({
      status,
      orderId,
      productOrderId
    })
    // setSwalProps({
    //   show: true,
    //   title: "Are you sure?",
    //   text: "Do you want to change the status?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, change it!",
    //   cancelButtonText: "Cancel",
    //   didClose: () => {
    //     setSwalProps({ show: false });
    //   },
    //   willClose: () => {
    //     setSwalProps({ show: false });
    //   }
    // });

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        changeStatus();
      }
    });


  }
  const changeStatus = async () => {
    try {
      const { status,orderId,productOrderId} = newStatus
      console.log('kkkkkkkkkkkkkk',status,orderId,productOrderId)
      const response = await axiosInstance.patch(
        `/admin/change-status/${status}/${orderId}/${productOrderId}`
      );
      if (response.status === 200) {
        setTriggerFetch((state) => !state);
        Swal.fire('Success', 'Status has been updated', 'success');
      }
    } catch (error) {
      console.log("change status", error);
      toast(error.response.data);
    }
    // setSwalProps({});
  };
 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-orders");
        if (response.status === 200) {
          console.log("asdfghjkl", response.data);
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.log("fetch orders ", error.message);
        toast(error.response.data);
      }
    };
    fetchOrders();
  }, [triggerFetch]);
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 bg-[#1a1f2e] min-h-screen">
     {/* <SweetAlert2
        {...swalProps}
        onConfirm={changeStatus}
      /> */}
      {orderDetails &&
        orderDetails.map((item, index) => (
          <div
            key={index}
            className="bg-[#232b3d] rounded-lg shadow-md border-[#2a344a] border p-6 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-shrink-0">
              <img
                className="w-52 h-52 object-cover border rounded-lg"
                src={`http://localhost:3000/uploads/images/${item?.productId?.images[0]}`}
                alt="image"
              />
            </div>

            <div className="flex-grow space-y-3">
              <h1 className="text-lg font-bold text-white">
                {item?.productId?.productName}
              </h1>
              <h3 className="text-base font-bold text-gray-400">
                {item?.productId?.brandId?.brand}
              </h3>

              <div className="space-y-1">
                {Object.entries(item?.variantId?.attributes).map(
                  ([key, value]) => (
                    <p className="text-sm text-gray-400" key={key}>
                      <span className="font-medium capitalize">{key}</span>:{" "}
                      {value}
                    </p>
                  )
                )}
              </div>

              <p className="text-sm text-gray-400">
                Quantity: {item?.quantity}
              </p>

              <div className="pt-2">
                <h4 className="text-xl font-bold text-white mb-2">
                  Shipping Address
                </h4>
                <div className="space-y-1">
                  {Object.entries(item?.shippingAddress).map(([key, value]) => (
                    <p className="text-sm text-gray-400" key={key}>
                      <span className="capitalize">{key}</span>: {value}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xl font-bold text-white mb-2">
                  User Details
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    Name:
                    <span className="text-base text-gray-300">
                      {item?.userDetails?.firstName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Email:
                    <span className="text-base text-gray-300">
                      {item?.userDetails?.email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    phone:
                    <span className="text-base text-gray-300">
                      {item?.userDetails?.phone}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Payment Method: {item?.paymentMethod}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff4d4d]"></span>
                  <p className="text-xl text-white">
                    Status: {item?.status}
                  </p>
                </div>

               
                  {item?.status === "Delivered" ? (
                    <p className="text-sm font-medium text-red-600">
                      Product Delivered
                    </p>
                  ) : item?.status === "Cancelled" ? (
                    <p className="text-sm font-medium text-red-600">
                      Cancelled Product
                    </p>
                  ) : item?.status === "Pending" ? (
                    <div>
                      <label htmlFor="status" className="text-white">
                        Change Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={"Pending"} 
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            item?.orderId,
                            item?.productOrderId
                          )
                        } 
                        className="bg-[#2a344a] text-white border-[#3a4357] border rounded px-2 py-1 focus:border-[#ff4d4d] focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                       
                      <label htmlFor="status" className="text-white">
                        Change Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={"Shipped"} 
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            item?.orderId,
                            item?.productOrderId
                          )}
                        className="bg-[#2a344a] text-white border-[#3a4357] border rounded px-2 py-1 focus:border-[#ff4d4d] focus:outline-none"
                      >
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      
                  
                
                    </div>
                  )}
                  
              </div>
            </div>

            {/* <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] cursor-pointer">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Rate & Review Product
              </div>
            </div> */}
          </div>
        ))}
    </div>
  );
};

export default Orders;

