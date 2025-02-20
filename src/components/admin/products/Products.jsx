import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import MoreProductDetails from "./MoreProductDetails";
import Pagination from "./utility/Pagination";

const Products = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [showMoreDetails, setShowMoreDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(() => parseInt(localStorage.getItem("currentPage")) || 1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const imageUrl = import.meta.env.VITE_IMG_URL

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

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
    return () => {
      localStorage.removeItem("currentPage"); // Remove when component unmounts
    };
  }, [currentPage]);
  


  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = productDetails.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/addproducts")}
          className="mb-8 px-6 py-3 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-semibold transition-colors duration-200"
        >
          Add Product
        </button>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl p-4">
          <table className="w-full border-collapse border border-gray-700 text-left">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-4 border border-gray-600">Image</th>
                <th className="p-4 border border-gray-600">Product Name</th>
                <th className="p-4 border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((product) => (
                <tr key={product._id} className="border border-gray-700">
                  <td className="p-4 border border-gray-600">
                    <img
                      src={`${imageUrl}${product.images[0]}`}
                      alt={"product image"}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 border border-gray-600 font-semibold">
                    {product.productName}
                  </td>
                  <td className="p-4 border border-gray-600">
                    {!showMoreDetails || showMoreDetails !== product._id ? (
                      <button
                        onClick={() => setShowMoreDetails(product._id)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-medium transition-colors duration-200"
                      >
                        More Details
                      </button>
                    ) : null}
                    {/* {showMoreDetails === product._id && (
                      <div className="mt-4">
                        <MoreProductDetails productId={product._id} />
                      </div>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalPosts={productDetails.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      {showMoreDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-black p-6 rounded-lg shadow-lg w-1/2">
            <button
              onClick={() => setShowMoreDetails(null)}
              className="absolute bg-red-700 px-1 rounded top-4 right-4 text-amber-500 hover:text-gray-800"
            >
              ✖
            </button>
            <MoreProductDetails productId={showMoreDetails} />
          </div>
        </div>
      )}
    </div>
  
  );
};

export default Products;
