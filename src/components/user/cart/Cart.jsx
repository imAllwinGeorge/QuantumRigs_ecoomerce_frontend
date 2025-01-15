import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useDispatch, useSelector } from "react-redux";
import { cartDetails } from "../../../redux/userSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.users);
  const [productInfo, setProductInfo] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  let discount = 10000; ////////////discount management need to be handled

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
      totalRegularPrice += curr.variant.regularPrice;
      totalSalePrice += curr.variant.salePrice;
      return [
        totalRegularPrice * curr.quantity,
        totalSalePrice * curr.quantity,
      ];
    },
    [0, 0]
  );
  console.log(productInfo, price, "qwertyuiopasdfghjk");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/get-cart/${user.id}`);
        if (response.status === 200) {
          console.log(response);
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
                    src={`http://localhost:3000/uploads/images/${item?.product?.images[0]}`}
                    alt=""
                  />
                  <div className="flex flex-col flex-grow">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {item?.product?.productName}
                    </h1>
                    <h3 className="text-lg text-gray-600 mb-2">
                      {item?.product?.brandId.brand}
                    </h3>

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
                        className="text-gray-800"
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
                      <h3 className="text-gray-800">{item.quantity}</h3>
                      <button
                        className="text-gray-800"
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
                      <button
                        className=" grid font-bold  py-1 px-2 text-md hover:text-red-500"
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
            <div className="w-full md:w-1/3 h-fit mt-14  sticky top-6 ">
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
                    <span>- ₹{discount}</span>
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
              <div className="mt-6">
                <button
                  className="w-full shadow-lg bg-amber-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors"
                  onClick={async () => {
                    const productDetails = await dispatch(
                      cartDetails({ productInfo, price, discount })
                    );
                    navigate("/place-order");
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
        <div>
          <h1 className="text-black">empty cart shop now</h1>
        </div>
      )}
    </div>
  );
};

export default Cart;
