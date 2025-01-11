import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";

const Home = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [brandDetails, setBrandDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
    try {
      
        const response = await axiosInstance.get("/home");
        if (response.status === 200) {
          console.log(response.data);
          setProductDetails(response.data.productDetails);
          setBrandDetails(response.data.brandDetails);
        }
        
      }
      
      
    catch (error) {
      console.log("fetchProductDetails", error);
      // toast(error.response.data)
      
    }
    
  }
  fetchProductDetails();
}, []);

  return (
    <div className="min-h-screen bg-white mx-10">
      {/* Hero Section */}
      <section
        className="relative w-full bg-gray-100 py-10 overflow-hidden"
        style={{
          backgroundImage: 'url("/background/download.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh", // Full viewport height
          width: "100%", // Full width of the container
        }}
      >
        <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col my-20 items-start space-y-6 z-10 max-w-xl">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
              CYBER MONDAY
            </h2>
            <p className="text-xl md:text-2xl text-gray-700">
              Incredible deals on gaming PCs and components
            </p>
            <button className="bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold py-3 px-8 rounded-full transition-colors duration-200">
              Shop Now
            </button>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              src="/banners/01733141860CYBER MONDAY LIAN LI SALE BANNER-desktop.jpg"
              alt="Gaming PC"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Fetched Products */}
      <div className="container bg-white  mx-auto px-4 py-20">
        <h2 className="text-3xl pt-10 text-black  md:text-4xl font-extrabold text-center mb-12">
          New Arrivals
        </h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productDetails &&
            productDetails.map((product) => (
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
                    src={`http://localhost:3000/uploads/images/${product.images[0]}`}
                    alt={product.productName}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-gray-500 line-through">
                    ₹{product?.variants[0]?.regularPrice}
                  </p>
                  <h5 className="text-xl font-bold text-gray-900">
                    ₹{product?.variants[0]?.salePrice}
                  </h5>
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
      <h1 className="text-black text-6xl font-bold my-20 ">Brands</h1>
      <div className="mx-auto text-5xl  grid grid-cols-4 gap-10 font-bold text-black">
        {brandDetails && brandDetails.map((brand) => <h3 key={brand._id}>{brand.brand}</h3>)}
      </div>
    </div>
  );
};

export default Home;
