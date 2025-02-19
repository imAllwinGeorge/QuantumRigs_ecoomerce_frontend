import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "./utility/CropImage";
import axiosInstance from "../../../api/Axios";
import Variant from "./Variant";
import { toast } from "react-toastify";

const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brandss, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [subCategoriess, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [productOffer, setProductOffer] = useState("");
  const [productOfferType, setProductOfferType] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errors, setErrors] = useState({});
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [productId, setProductId] = useState(null); // Store product ID

  const productAttributeFields = {
    Gaming: ["gpu", "ram", "storage"],
    professional: ["gpu", "ram", "storage"],
    ultrabooks: ["gpu", "ram", "storage"],
    WorkStations: ["gpu", "ram", "storage"],
    GamingStations: ["gpu", "ram", "storage"],
    Cooler: ["Fan_speed", "Cooling_Type"],
    RAM: ["size", "speed", "type"],
    Storage: ["capacity", "type"],
    GPU: ["memory_size", "memory_type", "core_clock", "boost_clock"],
    Motherboard: ["chipset", "form_factor"],
    cabinet: ["size"],
    smps: ["wattage", "efficiency"],
  };

  const handleImageSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCroppedImage = async () => {
    try {
      if (!selectedImage || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );

      const compressedImage = await imageCompression(croppedImage, {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      setImages((prev) => [...prev, compressedImage]);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error saving cropped image:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    const trimmedProductName = productName.trim();
    const trimmedDescription = description.trim();
    const trimmedBrandId = brandId.trim();
    const trimmedSubCategoryId = subCategoryId.trim();


    if(!trimmedProductName){
      newErrors.productName = 'productName cannot be empty'
    }
    if(!description){
      newErrors.description =  'description cannot be empty'
    }
    if(!brandId){
      newErrors.brandId = 'brand cannot be empty'
    }
    if(!subCategoryId){
      newErrors.subCategoryId = 'subCategory cannot be empty'
    }

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("productName", trimmedProductName);
    formData.append("description", trimmedDescription);
    formData.append("brandId", trimmedBrandId);
    formData.append("subCategoryId", trimmedSubCategoryId);
    formData.append("productOffer", productOffer);
    formData.append("productOfferType", productOfferType);

    // images.forEach((image, index) => {
    //   formData.append(`image${index}`, image, `image${index}.jpg`);
    // });
    images.forEach((image, index) => {
      formData.append("images", image); // Same field name as server expects
    });

    // Log formData entries for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axiosInstance.post("/admin/addproduct", formData);
      if (response.status === 201) {
        const productDetails = response.data.productDetails;
        console.log(productDetails);
        setProductId(productDetails._id);
        console.log("Product created successfully!");
        // Optionally, show success message
        toast("Product created successfully!");
      }
    } catch (error) {
      console.log("Error creating product:", error);
      // Optionally, show an error message to the user
      toast("Error creating product. Please try again.");
    }
  };

  const handleChange = (event, id) => {
    console.log(id);
    const value = event.target.options[event.target.selectedIndex].text;

    setSubCategoryId(id);

    if (value in productAttributeFields) {
      setVariantAttributes(productAttributeFields[value]);
    } else {
      setVariantAttributes([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/admin/addproduct");
        if (response.status === 200) {
          setSubCategories(response.data.subCategories);
          setBrands(response.data.brands);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Add Products</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800">
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.productName && (
              <span className="text-red-500 text-sm mt-1">{errors.productName}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">{errors.description}</span>
            )}
          </div>

          {/* Sub-Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sub-Category
            </label>
            <select
              onChange={(e) => handleChange(e, e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select Sub-Category --</option>
              {subCategoriess.map((subCate) => (
                <option key={subCate._id} value={subCate._id}>
                  {subCate.subCategory}
                </option>
              ))}
            </select>
            {errors.subCategoryId && (
              <span className="text-red-500 text-sm mt-1">{errors.subCategoryId}</span>
            )}
          </div>

          {/* Brands */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand
            </label>
            <select
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select Brand --</option>
              {brandss.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brand}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <span className="text-red-500 text-sm mt-1">{errors.brandId}</span>
            )}
          </div>

          {/* Product Offer */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Offer
            </label>
            <input
              type="number"
              value={productOffer || 0}
              onChange={(e) => setProductOffer(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter offer amount"
            />
          </div>

          {/* Product Offer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Offer Type
            </label>
            <select
              value={productOfferType}
              onChange={(e) => setProductOfferType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select Type Offer --</option>
              <option value="none">None</option>
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={images.length >= 3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-900 hover:file:bg-amber-600"
            />

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative h-[300px] w-full bg-gray-700 rounded-lg overflow-hidden">
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveCroppedImage}
                  className="w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Save Cropped Image
                </button>
              </div>
            )}

            {images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Uploaded Images:</h3>
                <div className="flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Cropped ${index}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!productId && (
          <button
            type="submit"
            className="w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-semibold"
          >
            Submit
          </button>
        )}
      </form>

      {productId && variantAttributes.length > 0 && (
        <div className="mt-8">
          <Variant variantAttributes={variantAttributes} productId={productId} subCategoryId={subCategoryId} />
        </div>
      )}
    </div>
  </div>
  );
};

export default AddProducts;
