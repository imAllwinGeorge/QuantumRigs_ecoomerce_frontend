import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useLocation, useNavigate } from "react-router-dom";

const MoreProductDetails = ({ productId }) => {
    const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState({});
  const [variantInfo, setVariantInfo] = useState([]);

  useEffect(() => {
    console.log(productId);
    const fetchMoreDetails = async () => {
      const response = await axiosInstance.get(
        `/admin/moreprodctdetails/${productId}`
      );
      console.log(response);
      if (response.status === 200) {
        setProductInfo(response.data.productInfo);

        setVariantInfo(response.data.variantInfo);
      }
    };
    fetchMoreDetails();
  }, []);
  return (
    <div>
      {productInfo && (
        <>
          <h3>Brand:{productInfo?.brandId?.brand}</h3>
          <h5>sub-Category:{productInfo?.subCategoryId?.subCategory}</h5>
        </>
      )}
      {variantInfo &&
        variantInfo.map((variant) => (
          <>
            <h4>Sale Price:{variant.salePrice}</h4>
            <h5>Regular Price:{variant.regularPrice}</h5>
            <h5>Quantity:{variant.quantity}</h5>
            <buttton
              onClick={() =>
                navigate("/admin/editproduct", {
                  state: { product: productInfo, variants: variantInfo },
                })
              }
            >
              Edit Product
            </buttton>
            
          </>
        ))}
    </div>
  );
};

export default MoreProductDetails;
