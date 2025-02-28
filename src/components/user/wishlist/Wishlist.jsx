import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { ShoppingCart } from "lucide-react";

const Wishlist = () => {
  const user = useSelector((state) => state.user.users);
  const [productInfo, setProductInfo] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const imageUrl = import.meta.env.VITE_IMG_URL;

  const addToCart = async (productId, variantId) => {
    try {
      const response = await axiosInstance.post("/add-to-cart", {
        productId,
        variantId,
        userId: user.id,
      });
      if (response.status === 200) {
        toast(response.data);
      }
    } catch (error) {
      console.log("addto cart", error.message);
      console.log(error.response);
    }
  };

  const removeProduct = async (productId, variantId) => {
    try {
      const response = await axiosInstance.delete(
        `/remove-product/${productId}/${variantId}/${user.id}`
      );
      if (response.status === 200) {
        setTriggerFetch((state) => !state);
        toast(response.data.message);
      }
    } catch (error) {
      console.log("remobe product from wishlist", error.message);
      toast(error.response.data);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/get-wishlist/${user.id}`);
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
    <div className="w-full md:w-2/3">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Wishlist</h1>
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
                          <span className="font-medium">{key}</span>: {value}
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

                  <div className="mt-3">
                    <button
                      onClick={() =>
                        addToCart(item?.product?._id, item?.variant?._id)
                      }
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-800 hover:text-gray-900"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <div>
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
  );
};

export default Wishlist;
