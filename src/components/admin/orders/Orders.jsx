import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";

import Swal from "sweetalert2";
import Pagination from "../products/utility/Pagination";

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => parseInt(localStorage.getItem("currentPage")) || 1);
    const [postsPerPage, setPostsPerPage] = useState(6);
  

  // const [swalProps, setSwalProps] = useState({});

  const handleChange = (
    status,
    orderId,
    productOrderId,
    variantId,
    quantity
  ) => {
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
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        changeStatus(status, orderId, productOrderId, variantId, quantity);
      }
    });
  };
  const changeStatus = async (
    status,
    orderId,
    productOrderId,
    variantId,
    quantity
  ) => {
    try {
      let message = "";
      if (status === "Cancelled") {
        message =
          "Order cancelled by admin. please contact admin for more details";
      }

      const response = await axiosInstance.patch(
        `/admin/change-status/${status}/${orderId}/${productOrderId}/${variantId}/${quantity}`,
        { message }
      );
      if (response.status === 200) {
        setTriggerFetch((state) => !state);
        Swal.fire("Success", "Status has been updated", "success");
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
  useEffect(() => {
      localStorage.setItem("currentPage", currentPage);
      return () => {
        localStorage.removeItem("currentPage"); // Remove when component unmounts
      };
    }, [currentPage]);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = orderDetails.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 bg-[#1a1f2e] min-h-screen">
      {currentPosts &&
        currentPosts.map((item, index) => (
          <div
            key={index}
            className="bg-[#232b3d] rounded-lg shadow-md border-[#2a344a] border p-6"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  className="w-52 h-52 object-cover border rounded-lg"
                  src={`http://localhost:3000/uploads/images/${item?.productId?.images[0]}`}
                  alt="image"
                />
              </div>

              {/* Main Content */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Details */}
                <div className="space-y-3">
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

                  {/* Price and Coupon Section */}
                  <div className="space-y-2">
                    <div className="text-white">
                      <h1>
                        Price:{" "}
                        <span>
                          {item?.purchasedAmount}
                        </span>
                      </h1>
                    </div>

                    {item?.couponDetails?.couponCode !== "" && (
                      <div className="space-y-1">
                        <h1 className="text-white">
                          Coupon Code:{" "}
                          <span className="text-red-600">
                            {item?.couponDetails?.couponCode}
                          </span>
                        </h1>
                        {item?.couponDetails?.couponType === "percentage" ? (
                          <h1>
                            Offer:{" "}
                            <span className="text-red-600">
                              {item?.couponDetails?.couponOffer}
                            </span>
                            %
                          </h1>
                        ) : (
                          <h1 className="text-white">
                            Offer:{" "}
                            <span className="text-red-600">
                              {item?.couponDetails?.couponOffer}
                            </span>{" "}
                            Flat
                          </h1>
                        )}
                        <h3 className="text-white">
                          Discount:{" "}
                          <span className="text-red-600">{item?.discount}</span>
                        </h3>
                      </div>
                    )}
                    <div className="text-white">
                      <h1>
                        Delivery Charge:{" "}
                        <span>
                          {item?.deliveryCharge}
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Address and User Details */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Shipping Address
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(item?.shippingAddress).map(
                        ([key, value]) => (
                          <p className="text-sm text-gray-400" key={key}>
                            <span className="capitalize">{key}</span>: {value}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* User Details */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      User Details
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">
                        Name:{" "}
                        <span className="text-base text-gray-300">
                          {item?.userDetails?.firstName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Email:{" "}
                        <span className="text-base text-gray-300">
                          {item?.userDetails?.email}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Phone:{" "}
                        <span className="text-base text-gray-300">
                          {item?.userDetails?.phone}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment and Status */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      Payment Method: {item?.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-400">
                      Payment Status: {item?.paymentStatus}
                    </p>

                    <div className="flex flex-col space-y-4 pt-2">
                      <div className="flex items-center justify-between">
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
                        ) : item?.status === "Returned" ? (
                          <p className="text-sm font-medium text-red-600">
                            Product Returned
                          </p>
                        ) : (
                          <div className="flex flex-col items-end">
                            <label
                              htmlFor="status"
                              className="text-white text-sm mb-1"
                            >
                              Change Status
                            </label>
                            <select
                              name="status"
                              id="status"
                              value={
                                item?.status === "Pending"
                                  ? "Pending"
                                  : "Shipped"
                              }
                              onChange={(e) =>
                                handleChange(
                                  e.target.value,
                                  item?.orderId,
                                  item?.productOrderId,
                                  item?.variantId?._id,
                                  item?.quantity
                                )
                              }
                              className="bg-[#2a344a] text-white border-[#3a4357] border rounded px-2 py-1 focus:border-[#ff4d4d] focus:outline-none text-sm"
                            >
                              {item?.status === "Pending" && (
                                <option value="Pending">Pending</option>
                              )}
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {item?.status === "Cancelled" && item?.message !== "" && (
                        <div className="mt-2">
                          <h1 className="text-red-600 text-sm">
                            {item?.message}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Pagination
        totalPosts={orderDetails.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Orders;
