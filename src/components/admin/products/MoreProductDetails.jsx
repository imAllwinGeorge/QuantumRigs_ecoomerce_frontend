import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useLocation, useNavigate } from "react-router-dom";

const MoreProductDetails = ({ productId }) => {
    const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState({});
  const [variantInfo, setVariantInfo] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({})



  useEffect(() => {
    console.log(productId);
    const fetchMoreDetails = async () => {
      const response = await axiosInstance.get(
        `/admin/moreprodctdetails/${productId}`
      );
      console.log(response);
      if (response.status === 200) {
        setProductInfo(response?.data?.productInfo);

        setVariantInfo(response?.data?.variantInfo);

      }
    };
    fetchMoreDetails();
  }, []);
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 mt-4">
      {productInfo && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Brand: <span className="text-amber-400">{productInfo?.brandId?.brand}</span>
          </h3>
          <h5 className="text-lg text-gray-300">
            Sub-Category: <span className="text-amber-400">{productInfo?.subCategoryId?.subCategory}</span>
          </h5>
        </div>
      )}
      
      {variantInfo && variantInfo.length > 0 && (
        <div className="space-y-4">
          {variantInfo.map((variant, index) => (
            <div key={index} className="bg-gray-700 rounded-md p-4 ">
                <h2>{productInfo.activeOffer !== 0?<span>{productInfo.activeOffer}</span>:null}{productInfo.activeOfferType == 'percentage'?<span>%</span>:productInfo.activeOfferType === 'flat'?<span>Flat</span>:null}</h2>
              <h4 className="text-lg font-medium text-white mb-2">
                Sale Price: <span className="text-amber-400">${variant.salePrice}</span>
              </h4>

              <h5 className="text-md text-gray-300 mb-2">
                Regular Price: <span className="line-through">${variant.regularPrice}</span>
              </h5>
              <h5 className="text-md text-gray-300 mb-4">
                Quantity: <span className="text-amber-400">{variant.quantity}</span>
              </h5>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={() =>
          navigate("/admin/editproduct", {
            state: { product: productInfo, variants: variantInfo },
          })
        }
        className="mt-6 w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-semibold transition-colors duration-200"
      >
        Edit Product
      </button>
    </div>
  );
};

export default MoreProductDetails;
