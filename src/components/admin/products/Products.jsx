import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import MoreProductDetails from "./MoreProductDetails";

const Products = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axiosInstance.get("/admin/getproductdetails");
      console.log(response);
      if (response) {
        setProductDetails(response.data);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div>
      <button onClick={() => navigate("/admin/addproducts")}>
        Add Product
      </button>
      {productDetails.map((product) => (
        <div key={product._id}>
          <img
            src={`http://localhost:3000/uploads/images/${product.images[0]}`}
            alt="image"
          />
          <h3>{product.productName}</h3>
          
          {!showMoreDetails || showMoreDetails !== product._id ? (
            <button
              onClick={() => {
                setShowMoreDetails(product._id);
              }}
            >
              More Details
            </button>
          ) : null}
          {showMoreDetails === product._id ? (
            <MoreProductDetails productId={product._id} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Products;
