import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../api/Axios";

const ProductDescription = () => {
  const location = useLocation();
  const { productId } = location.state;
  const [productDetails, setProductDetails] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [showImage, setShowImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/product/${productId}`);
        if (response.status === 200) {
          setProductDetails(response.data.productDetails);
          setVariantDetails(response.data.variantDetails);
          setProductImages(response.data.productDetails.images);
        }
      } catch (error) {
        console.log("fetchProductDetails", error);
      }
    };
    fetchProductDetails();
  }, [productId]);

  const handleMouseMove = (e) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto bg-white px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="relative z-0">
        <div
          className="relative w-full z-0 aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
        >
          {productImages.length > 0 && (
            <img
              src={`http://localhost:3000/uploads/images/${productImages[showImage]}`}
              alt={productDetails.productName || "Product image"}
              className="w-full h-full object-contain z-0"
            />
          )}

          {isZooming && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: `url(http://localhost:3000/uploads/images/${productImages[showImage]})`,
                backgroundSize: "200%", // Adjust zoom level
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          )}
        </div>

        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
          {productImages?.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:3000/uploads/images/${image}`}
              alt={`${productDetails.productName || "Product"} - ${index + 1}`}
              className="w-40 h-auto object-contain p-2 cursor-pointer"
              onClick={() => setShowImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl text-[#353535] font-semibold">
          {productDetails?.brandId?.brand}
        </h1>
        <h2 className="text-3xl font-bold text-black">
          {productDetails.productName}
        </h2>
        <div className="text-xl text-yellow-400">
          {"★".repeat(4)}
          <span className="text-gray-300">{"☆".repeat(1)}</span>
        </div>

        {variantDetails?.length > 0 && (
          <div className="flex items-baseline gap-4 my-4">
            <h3 className="text-3xl font-bold text-gray-800">
              ₹{variantDetails[0]?.salePrice}
            </h3>
            <p className="text-xl text-red-500 line-through">
              ₹{variantDetails[0]?.regularPrice}
            </p>
          </div>
        )}

        <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line">
          {productDetails.description}
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
