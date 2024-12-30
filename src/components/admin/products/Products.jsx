import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import MoreProductDetails from "./MoreProductDetails";
import Pagination from "./utility/Pagination";

const Products = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

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
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = productDetails.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/addproducts")}
          className="mb-8 px-6 py-3 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-semibold transition-colors duration-200"
        >
          Add Product
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`http://localhost:3000/uploads/images/${product.images[0]}`}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 truncate">
                  {product.productName}
                </h3>

                {!showMoreDetails || showMoreDetails !== product._id ? (
                  <button
                    onClick={() => setShowMoreDetails(product._id)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-medium transition-colors duration-200"
                  >
                    More Details
                  </button>
                ) : null}

                {showMoreDetails === product._id && (
                  <div className="mt-4">
                    <MoreProductDetails productId={product._id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        totalPosts={productDetails.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Products;
