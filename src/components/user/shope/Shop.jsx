import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

const Shop = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brandDetails, setBrandDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get("/home");
        if (response.status === 200) {
          console.log(response.data);
          setProductDetails(response?.data?.productDetails);
          setFilteredProducts(response?.data?.productDetails);
          setBrandDetails(response?.data?.brandDetails)
        }
      } catch (error) {
        console.log("fetch product details shop page", error.message);
        toast(error.response.data);
      }
    };
    fetchProductDetails();
  }, []);

  const onFilterChange = useCallback(({ priceRange, filters, sorts, brands }) => {
    let newFilteredProducts = [...productDetails];

    // Apply price filter
    newFilteredProducts = newFilteredProducts.filter(product => {
      const salePrice = product.variants?.[0]?.salePrice;
      return salePrice !== undefined && salePrice >= priceRange.min && salePrice <= priceRange.max;
    });

    // Apply brand filter
    if (brands.length > 0) {
      newFilteredProducts = newFilteredProducts.filter(product => 
        product.brandId && brands.includes(product.brandId)
      );
    }

    // Apply other filters
    if (filters.includes("New arrivals")) {
      newFilteredProducts = newFilteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    // Add more filter logic here for other filter types

    // Apply sorting
    if (sorts.length > 0) {
      const sortMethod = sorts[0];
      switch (sortMethod) {
        case "aA - zZ":
          newFilteredProducts.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
          break;
        case "zZ - aA":
          newFilteredProducts.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''));
          break;
        case "Price: Low to High":
          newFilteredProducts.sort((a, b) => (a.variants?.[0]?.salePrice || 0) - (b.variants?.[0]?.salePrice || 0));
          break;
        case "Price: High to Low":
          newFilteredProducts.sort((a, b) => (b.variants?.[0]?.salePrice || 0) - (a.variants?.[0]?.salePrice || 0));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(newFilteredProducts);
  }, [productDetails]);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row">
        <Filters brandDetails={brandDetails} onFilterChange={onFilterChange} />
        <div className="flex-1 md:ml-8">
          <h2 className="text-3xl pt-10 text-black md:text-4xl font-extrabold text-center mb-12">
            Shop
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() =>
                  navigate("/product_description", {
                    state: { productId: product._id },
                  })
                }
                className="bg-slate-300 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 m-0"
                    src={`http://localhost:3000/uploads/images/${product.images?.[0] || 'default-image.jpg'}`}
                    alt={product.productName || 'Product image'}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.productName || 'Unnamed Product'}
                  </h3>
                  {product.variants?.[0]?.regularPrice && (
                    <p className="text-gray-500 line-through">
                      ₹{product.variants[0].regularPrice}
                    </p>
                  )}
                  {product.variants?.[0]?.salePrice && (
                    <h5 className="text-xl font-bold text-gray-900">
                      ₹{product.variants[0].salePrice}
                    </h5>
                  )}
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">
                      {"★".repeat(4)}
                      <span className="text-gray-300">{"☆".repeat(1)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shop;

