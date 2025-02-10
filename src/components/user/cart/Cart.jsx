import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useDispatch, useSelector } from "react-redux";
import { cartDetails } from "../../../redux/userSlice";

const Cart = () => {
  const imageUrl = import.meta.env.VITE_IMG_URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.users);
  const [productInfo, setProductInfo] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState({
    couponCode: "",
    couponOffer: 0,
    couponType: "",
    minPurchaseAmmount: 0,
    maxDiscountAmmount: 0,
  });
  console.log("hhhhhhhhhhhhhssssssssssss", coupons);
  const calculateDiscount = (coupon) => {
    if (coupon.couponType === "flat") {
      setDiscount(coupon.couponOffer);
    } else {
      let couponDiscount = (price[1] * coupon.couponOffer) / 100;
      couponDiscount < coupon.maxDiscountAmmount
        ? setDiscount(couponDiscount)
        : setDiscount(coupon.maxDiscountAmmount);
    }
  }; ////////////discount management need to be handled

  const handleQuantity = async (action, productId, variantId) => {
    try {
      const value = action === "increase" ? 1 : -1;

      const response = await axiosInstance.patch(
        `/cart-quantity/${productId}/${variantId}/${user.id}/${value}`
      );

      if (response.status === 200) {
        setTriggerFetch((prev) => !prev); // Toggle triggerFetch to re-fetch data
        const updatedCartQuantity = productInfo.map((item) => {
          if (item.product._id === productId) {
            return { ...item, quantity: item.quantity + value };
          }
          return item;
        });
        setProductInfo(updatedCartQuantity);
      }
    } catch (error) {
      console.log("quantity handling", error);
      toast(error.response?.data || "Error updating quantity");
    }
  };

  const removeProduct = async (productId, variantId) => {
    try {
      const response = await axiosInstance.delete(
        `/remove-item/${productId}/${variantId}/${user.id}`
      );
      if (response.status === 200) {
        setTriggerFetch((prev) => !prev);
        toast(response.data);
      }
    } catch (error) {
      console.log("remove product from cart", error.message);
      toast(error.response.data);
    }
  };

  const price = productInfo.reduce(
    ([totalRegularPrice, totalSalePrice], curr) => {
      totalRegularPrice += curr.variant.regularPrice * curr.quantity;
      totalSalePrice += curr.variant.salePrice * curr.quantity;
      return [totalRegularPrice, totalSalePrice];
    },
    [0, 0]
  );
  const CouponDetail = ({ label, value }) => (
    <h3 className="text-sm text-gray-300">
      {label}: <span className="ml-2 text-white font-medium">{value}</span>
    </h3>
  );
  const toggleDetails = (id) => {
    setShowMoreDetails((prev) => (prev === id ? null : id));
  };

  console.log(productInfo, "qwertyui", price, "qwertyuiopasdfghjk");
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance("/get-coupons");
        if (response.status === 200) {
          console.log("coupon", response);
          setCoupons(response?.data?.coupons);
        }
      } catch (error) {
        console.log("fetch coupons cart", error.message);
        toast(error.response.data.message);
      }
    };
    fetchCoupons();
  }, [triggerFetch]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/get-cart/${user.id}`);
        if (response.status === 200) {
          setProductInfo(response.data);
        }
      } catch (error) {
        console.log("cart fetchproductDetails", error);

        toast(error.response.data);
      }
    };
    fetchProductDetails();
  }, [triggerFetch]);
  return (
    <div className=" max-w-6xl mx-auto p-6 pb-20 md:pb-6 flex flex-col md:flex-row gap-6">
      {productInfo.length > 0 ? (
        <>
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Cart</h1>
            {productInfo &&
              productInfo.map((item, index) => (
                <div
                  className="text-black flex flex-col shadow-lg md:flex-row gap-6 p-4 mb-4 border border-gray-200 rounded-lg"
                  key={index}
                >
                  <img
                    className="w-40  md:w-40 h-40 object-cover rounded-lg border border-gray-200"
                    src={`${imageUrl}${item?.product?.images[0]}`}
                    alt=""
                  />
                  <div className="flex flex-col flex-grow">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {item?.product?.productName}
                    </h1>
                    <h3 className="text-lg text-gray-600 mb-2">
                      {item?.product?.brandId.brand}
                    </h3>
                    <h2 className="text-red-500 font-semibold">
                      {item?.product?.activeOffer !== 0 && (
                        <>
                          <span>{item?.product?.activeOffer}</span>
                          {item?.product?.activeOfferType === "percentage" && (
                            <span>%</span>
                          )}
                          {item?.product?.activeOfferType === "flat" && (
                            <span>Flat</span>
                          )}
                        </>
                      )}
                    </h2>

                    {item.product._id === item.variant.productId && (
                      <>
                        <div className="space-y-1 mb-4">
                          {Object.entries(item?.variant?.attributes).map(
                            ([key, value]) => (
                              <p className="text-sm text-gray-600" key={key}>
                                <span className="font-medium">{key}</span>:{" "}
                                {value}
                              </p>
                            )
                          )}
                        </div>
                        <div className="mt-auto">
                          <h5 className="text-red-500 line-through text-lg">
                            ₹{item.variant.regularPrice}
                          </h5>
                          <h5 className="text-gray-800 text-xl font-semibold">
                            ₹{item.variant.salePrice}
                          </h5>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <div>
                      <button
                        className="text-gray-800 border rounded px-5"
                        onClick={() => {
                          if (
                            item.variant.quantity > item.quantity &&
                            item.quantity < 5
                          ) {
                            handleQuantity(
                              "increase",
                              item.product._id,
                              item.variant._id
                            );
                          } else {
                            toast("stock quantity exceeded");
                          }
                        }}
                      >
                        +
                      </button>
                      <h3 className="text-gray-800 ml-5">{item.quantity}</h3>
                     
                      <button
                        className="text-gray-800 border rounded px-5"
                        onClick={() => {
                          if (item.quantity > 1) {
                            handleQuantity(
                              "decrease",
                              item.product._id,
                              item.variant._id
                            );
                          } else {
                            toast("item cannot be less than 1");
                          }
                        }}
                      >
                        -
                      </button>
                      {item.variant.quantity > item.quantity ? (
                        null
                      ) : (
                        <>
                        
                        <h3 className="text-red-500 ml-5">{`only ${item.variant.quantity} available`}</h3>
                        </>
                      )}
                      <button
                        className=" grid font-bold mt-10 border bg-red-500 rounded-lg py-1 px-4 text-white text-md hover:text-red-500"
                        onClick={() => {
                          removeProduct(item.product._id, item.variant._id);
                        }}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {price && (
            <div className="w-full md:w-1/3 h-fit mt-14 sticky top-6">
              {coupons &&
                coupons.map((coupon) =>
                  coupon.minPurchaseAmmount < price[1] ? (
                    <div
                      key={coupon._id}
                      className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-medium text-white">
                            Coupon Code:{" "}
                            <span className="ml-2 text-amber-400">
                              {coupon.couponCode}
                            </span>
                          </h2>
                        </div>

                        <div className="space-y-2">
                          <CouponDetail
                            label="Offer Value"
                            value={`${coupon.couponOffer} ${
                              coupon.couponType === "flat" ? "Flat" : "%"
                            }`}
                          />
                          {showMoreDetails === coupon._id && (
                            <>
                              <CouponDetail
                                label="Minimum Purchase Amount"
                                value={coupon.minPurchaseAmmount}
                              />
                              <CouponDetail
                                label="Maximum Discount Amount"
                                value={coupon.maxDiscountAmmount}
                              />
                              <CouponDetail
                                label="Starting Date"
                                value={coupon.startingDate}
                              />
                              <CouponDetail
                                label="Expiry Date"
                                value={coupon.expiryDate}
                              />
                            </>
                          )}
                          <button
                            onClick={() => toggleDetails(coupon._id)}
                            className="text-blue-400 hover:underline"
                          >
                            {showMoreDetails === coupon._id
                              ? "Less details"
                              : "More details"}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-700">
                        <button
                          className="w-full bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                          onClick={() => {
                            calculateDiscount(coupon);
                            setAppliedCoupon({
                              couponCode: coupon.couponCode,
                              couponOffer: coupon.couponOffer,
                              couponType: coupon.couponType,
                              minPurchaseAmmount: coupon.minPurchaseAmmount,
                              maxDiscountAmmount: coupon.maxDiscountAmmount,
                            });
                          }}
                        >
                          Apply Coupon
                        </button>
                        <div>
                          <button
                            onClick={() => {
                              setDiscount(0);
                              setAppliedCoupon({
                                couponCode: "",
                                couponOffer: 0,
                                couponType: "",
                                minPurchaseAmmount: 0,
                                maxDiscountAmmount: 0,
                              });
                            }}
                            className="bg-red-500 rounded-md w-full my-5 py-3"
                          >
                            Remove Coupon
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}

              {/* Price Details */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Price Details
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <h4>Regular Price</h4>
                    <span>₹{price[0]}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <h4>Offer Price</h4>
                    <span>₹{price[1]}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <h4>Discount</h4>
                    <span> ₹{discount}</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <h1 className="text-xl font-bold text-gray-800">
                    Total Price
                  </h1>
                  <span className="text-xl font-bold text-gray-800">
                    ₹{price[1] - discount}
                  </span>
                </div>
              </div>

              {/* Place Order */}
              <div className="mt-6">
                <button
                  className="w-full shadow-lg bg-amber-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors"
                  onClick={async () => {
                    try {
                      const productDetails = await dispatch(
                        cartDetails({
                          productInfo,
                          price,
                          discount,
                          appliedCoupon,
                        })
                      );
                      navigate("/place-order");
                    } catch (error) {
                      console.error("Error placing order:", error);
                    }
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}

          {/* <div className=" fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg md:static md:shadow-none md:p-0 md:bg-transparent md:mt-4">
            <button
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={async () => {
                const productDetails = await dispatch(
                  cartDetails({ productInfo, price, discount })
                );
                navigate("/place-order");
              }}
            >
              Place Order
            </button>
          </div> */}
        </>
      ) : (
        <div className="min-h-screen bg-white text-gray-800 py-10 px-4 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 text-lg">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Shop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
