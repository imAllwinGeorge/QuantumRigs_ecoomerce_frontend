import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";
import { ShoppingCart,Heart } from "lucide-react";
import { useSelector } from "react-redux";





const ProductDescription = () => {
  const imageUrl = import.meta.env.VITE_IMG_URL
  const user = useSelector(state=>state.user.users)
  console.log('1234567',user)
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state;
  const [productDetails, setProductDetails] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarVariantList, setSimilarVariantList] = useState([]);
  const [showImage, setShowImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
 

  const productSelection = (selectedProductId)=>{
   
    navigate('/product_description',{state:{productId:selectedProductId}})
  }


  const addToCart = async(productId,variantId)=>{
    try {
      const response = await axiosInstance.post ('/add-to-cart',{productId,variantId,userId:user.id})
    if(response.status === 200){
      toast(response.data)
      
    }
    } catch (error) {
      console.log('addto cart',error.message)
      console.log(error.response)
      
    }
    
  }

  const addToWishlist = async (productId,variantId)=>{
    try {
      const response = await axiosInstance.post(`/addto-wishlist/${productId}/${variantId}/${user.id}`);
      if(response.status === 200){
        toast(response.data.message)
      }
    } catch (error) {
      console.log('add to wishlist',error.message);
      toast(error.response.data.message)
    }
  }
 

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/product/${productId}`);
        if (response.status === 200) {
          console.log(response.data.similarProductVariants);
          setProductDetails(response.data.productDetails);
          setVariantDetails(response.data.variantDetails);
          setSimilarProducts(response.data.similarProducts);
          setProductImages(response.data.productDetails.images);
          setSimilarVariantList(response.data.similarProductVariants);
          console.log("asdfghjk", similarVariantList);
        }
      } catch (error) {
        console.log("fetchProductDetails", error);
        toast(error.response.data);
        
      }
    };
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    console.log("Updated similarVariantList:", similarVariantList);
  }, [similarVariantList]);

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
              src={`${imageUrl}${productImages[showImage]}`}
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
              src={`${imageUrl}${image}`}
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
        <h2 className="text-red-500 font-bold">
                    {productDetails.activeOffer !== 0 && (
                      <>
                        <span>{productDetails.activeOffer}</span>
                        {productDetails.activeOfferType === "percentage" && (
                          <span>%</span>
                        )}
                        {productDetails.activeOfferType === "flat" && (
                          <span>Flat</span>
                        )}
                      </>
                    )}
                  </h2>

        {variantDetails?.length > 0 && (
          <>
          <div className="flex items-baseline gap-4 my-4">
            <h3 className="text-3xl font-bold text-gray-800">
              ₹{variantDetails[0]?.salePrice}
            </h3>
            <p className="text-xl text-red-500 line-through">
              ₹{variantDetails[0]?.regularPrice}
            </p>
            
             
            
          </div>
           <div className="w-32 text-center font-bold">
           {variantDetails[0]?.quantity !== 0?<h5 className="text-xl text-black bg-green-400 rounded-md p-2 px-4 ">
            inStock
          </h5>:<h5 className="text-xl text-white  bg-red-800 rounded-md p-2 px-4 ">
            Sold Out
          </h5>}
           </div>
           <div>
          {variantDetails[0].quantity !== 0 &&<button className="text-black py-4 px-6 border border-gray-600 rounded " onClick={()=>addToCart(productDetails._id,variantDetails[0]?._id)}><ShoppingCart size={24} /></button>}\
          <button className="text-black py-4 px-6 border border-gray-600 rounded" onClick={()=>addToWishlist(productDetails._id,variantDetails[0]?._id)}><Heart /></button>
          
        </div>
          </>
        )}
       


        <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line">
          {productDetails.description}
        </p>
      </div>
      {similarProducts && (
  <div className="col-span-1 lg:col-span-2 w-full bg-white">
    <h1 className="font-bold text-black text-4xl mb-6">Recommended Products</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {similarProducts.map((product) => (
        <div key={product._id} className="bg-slate-100 rounded-xl overflow-hidden" onClick={()=>productSelection(product._id)} >
          <div className="aspect-square relative">
            <img
              src={`${imageUrl}${product.images[0]}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h1 className="text-black font-semibold text-lg">{product.brandId.brand}</h1>
            <h3 className="text-black text-sm mb-2">{product.productName}</h3>
            {similarVariantList &&
              similarVariantList.map(
                (variant) =>
                  product._id == variant.productId && (
                    <div key={variant._id} className="space-y-1">
                      <h1 className="text-gray-500 line-through text-sm">₹{variant.regularPrice}</h1>
                      <h1 className="text-black font-bold text-xl">₹{variant.salePrice}</h1>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(4)}
                        {'☆'.repeat(1)}
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default ProductDescription;
