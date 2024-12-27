import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import ReactImageMagnify from 'react-image-magnify';
import ImageMagnifier from "./ImageMagnifier";
import "./ProductDescription.css";

const ProductDescription = () => {
  const location = useLocation();
  const { productId } = location.state;
  const [productDetails, setProductDetails] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [showImage, setShowImage] = useState(0);


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

  
  return (
    <div className="product-description-container">
      <div className="product-description-images">
        <div className="product-description-image-container">
          {productImages && productImages.length > 0 && (
            // <ImageMagnifier
            //   imageSrc={`http://localhost:3000/uploads/images/${productImages[showImage]}`}
            //   alt={productDetails.productName || "Product image"}
            // />
            <ReactImageMagnify {...{
                smallImage: {
                    alt: 'Wristwatch by Ted Baker London',
                    isFluidWidth: true,
                    src:`http://localhost:3000/uploads/images/${productImages[showImage]}`
                },
                largeImage: {
                    src: `http://localhost:3000/uploads/images/${productImages[showImage]}`,
                    width: 1200,  // Use dynamic width if available
                    height: 1800 // Use dynamic height if available
                }
            }} 
            enlargedImagePosition="over" // Overlay the popup
        style={{
          zIndex: 9999, // Ensure it's in front
          position: 'absolute',
        }}
            />
          )}
        </div>

        <div className="product-description-thumbnails">
          {productImages?.map((image, index) => (
            <div
              key={index}
              className={`product-description-thumbnail ${
                index === showImage ? "active" : ""
              }`}
              onClick={() => setShowImage(index)}
            >
              <img
                src={`http://localhost:3000/uploads/images/${image}`}
                alt={`${productDetails.productName || "Product"} - ${
                  index + 1
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="product-description-details">
        <h1 className="product-description-brand">
          {productDetails?.brandId?.brand}
        </h1>
        <h2 className="product-description-name">
          {productDetails.productName}
        </h2>
        <span className="rating">
          {"★".repeat(4)}
          {"☆".repeat(1)}
        </span>

        {variantDetails?.length > 0 && (
          <div className="product-description-price-container">
            <h3 className="product-description-sale-price">
              ₹{variantDetails[0]?.salePrice}
            </h3>
            <p className="product-description-regular-price">
              ₹{variantDetails[0]?.regularPrice}
            </p>
          </div>
        )}

        <p className="product-description-text">{productDetails.description}</p>
      </div>
    </div>
  );
};

export default ProductDescription;
