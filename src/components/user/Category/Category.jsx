import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  console.log(subCategories.length);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category/products");
        console.log(response);
        if (response.status === 200) {
          setProducts(response?.data?.products);
          setSubCategories(response?.data?.subCategories);
        }
      } catch (error) {
        console.log("category filtering", error.message);
        toast(error.response.data);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      {subCategories &&
        subCategories.map((subCategory) => (
          <div key={subCategory} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{subCategory}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products &&
                products.map((product) => (
                  product.subCategory.subCategory === subCategory?(
                  <div
                    key={product._id}
                    onClick={() =>
                      navigate("/product_description", {
                        state: { productId: product._id },
                      })
                    }
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                        src={`http://localhost:3000/uploads/images/${product.images[0]}`}
                        alt={product.productName}
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.productName}
                      </h3>
                      <div>
                        <p className="text-sm text-gray-500 line-through mb-1">
                          ₹{product?.variants[0]?.regularPrice}
                        </p>
                        {product.activeOffer !== 0 && (
                          <h2 className="text-sm font-semibold text-green-600 mb-1">
                            {product.activeOffer}
                            {product.activeOfferType === "percentage" && "%"}
                            {product.activeOfferType === "flat" && " Flat"} OFF
                          </h2>
                        )}
                        <h5 className="text-xl font-bold text-gray-900 mb-2">
                          ₹{product?.variants[0]?.salePrice}
                        </h5>
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-sm">
                            {"★".repeat(4)}
                            <span className="text-gray-300">{"☆".repeat(1)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>)
                  :null
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Category;
