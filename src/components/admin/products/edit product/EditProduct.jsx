import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "../utility/CropImage";
import axiosInstance from "../../../../api/Axios";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(location?.state?.product || {});
  const [variantInfo, setVariantInfo] = useState(location.state.variants);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleDeleteBtn = async (image, productId) => {
    try {
      const response = await axiosInstance.delete("/admin/deleteimage", {
        data: { image, productId },
      });
      if (response.status === 200) {
        setProductInfo(response.data);
        toast("success")
      }
    } catch (error) {
      console.error("handleDeleteBtn", error);
      toast(error.response.data)
    }
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
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error("Error saving cropped image:", error);
      toast(error.response.data)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value ,
    }));
  
    
  };
  useEffect(() => {
    console.log("Updated productInfo:", productInfo);
  }, [productInfo]);

  const handleAttributeChange = useCallback((variantId, key, value) => {
    setVariantInfo((prevVariants) =>
      prevVariants.map((variant) =>
        variant._id === variantId
          ? {
              ...variant,
              attributes: {
                ...variant.attributes,
                [key]: value,
              },
            }
          : variant
      )
    );
  }, []);

  const handleVariantChange = useCallback((variantId, field, value) => {
    setVariantInfo((prevVariants) =>
      prevVariants.map((variant) =>
        variant._id === variantId
          ? {
              ...variant,
              [field]:
                field === "quantity" ? parseInt(value, 10) : parseFloat(value),
            }
          : variant
      )
    );
  }, []);

  const handleVariantSubmit = useCallback(
    async (e, variantId,productId,subCategoryId) => {
      e.preventDefault();
      const variantToUpdate = variantInfo.find((v) => v._id === variantId);

      try {
        const response = await axiosInstance.put(
          `/admin/updateVariant/${variantId}`,
          { variantToUpdate,productId,subCategoryId,regularPrice:variantToUpdate.regularPrice }
        );

        if (response.status === 200) {
          toast(`Product edited successful`);
          navigate(-1);
        } else {
          throw new Error("Failed to update variant");
        }
      } catch (error) {
        console.error("Error updating variant:", error);
        toast(error.response.data)
      }
    },
    [variantInfo, navigate]
  );
  // const createFormData = async () => {
  //   const formData = new FormData();

  //   // Add basic product info
  //   formData.append('_id', productInfo._id);
  //   formData.append('productName', productInfo.productName);
  //   formData.append('description', productInfo.description);
  //   formData.append('brandId', productInfo.brand);
  //   formData.append('subCategoryId', productInfo.subCategory);
  //   formData.append('productOffer', productInfo.productOffer.toString());
  //   formData.append('productOfferType', productInfo.productOfferType);
  //   formData.append('isListed', productInfo.isListed.toString());

  //   // Add existing images array
  //   formData.append('images', JSON.stringify(productInfo.images));

  //   // Add new images
  //   for (let i = 0; i < images.length; i++) {
  //     formData.append('newImages', images[i]);
  //   }

  //   return formData;
  // };
  const createFormData = async () => {
    console.log(productInfo)
    const formData = new FormData();

    formData.append("_id", productInfo._id);
    formData.append("productName", productInfo.productName);
    formData.append("description", productInfo.description);
    formData.append("brandId", productInfo.brandId._id || productInfo.brandId);
    formData.append("subCategoryId", productInfo.subCategoryId._id || productInfo.subCategoryId );
    formData.append("productOffer", productInfo.productOffer.toString());
    formData.append("productOfferType", productInfo.productOfferType);
    formData.append("isListed", productInfo.isListed.toString());

    // // Append existing images individually
    // productInfo.images.forEach((image, index) => {
    //   formData.append(`existingImages[${index}]`,JSON.stringify(productInfo.images));
    // });

    // Append new images
    images.forEach((image, index) => {
      formData.append("newImages", image);
    });

    return formData;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = await createFormData();

      const response = await axiosInstance.put("/admin/editproduct", formData);

      if (response.status === 200) {
        toast("Product edited successfully");
        navigate(-1);
      }
    } catch (error) {
      console.log("handleSubmit", error);
      toast(error.response.data)
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
        console.error("Error fetching data:", error);
        toast(error.response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-amber-400">Edit Product</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-amber-300">Current Images</h2>
        <div className="flex flex-wrap gap-4">
          {productInfo?.images.map((image) => (
            <div key={image} className="relative">
              <img
                src={`http://localhost:3000/uploads/images/${image}`}
                alt=""
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteBtn(image, productInfo._id)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                type="button"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={productInfo.productName}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productInfo.description}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">
            Brand
          </label>
          <select
            id="brand"
            name="brandId"
            value={productInfo.brandId._id}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">--Select Brand--</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-300 mb-1">
            Sub-Category
          </label>
          <select
            id="subCategory"
            name="subCategoryId"
            value={productInfo.subCategoryId._id}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">-- Select Sub-Category --</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.subCategory}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="productOffer" className="block text-sm font-medium text-gray-300 mb-1">
            Product Offer
          </label>
          <input
            type="text"
            id="productOffer"
            name="productOffer"
            value={productInfo.productOffer}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="productOfferType" className="block text-sm font-medium text-gray-300 mb-1">
            Product Offer Type
          </label>
          <select
            id="productOfferType"
            name="productOfferType"
            value={productInfo.productOfferType}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">-- Select Offer Type --</option>
            <option value="none">None</option>
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Upload Images:</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={images.length >= 3}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-900 hover:file:bg-amber-600"
          />
        </div>

        {selectedImage && (
          <div className="mb-6">
            <div className="cropper-container h-64 relative">
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
              className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              Save Cropped Image
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-300">Uploaded Images:</h3>
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

        <button type="submit" className="w-full bg-amber-500 text-gray-900 px-4 py-2 rounded-md hover:bg-amber-600 transition-colors font-semibold">
          Submit
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 text-amber-300">Variants</h3>

        {variantInfo.length > 0 ? (
          variantInfo.map((variant) => (
            <form
              key={variant._id}
              onSubmit={(e) => handleVariantSubmit(e, variant._id,productInfo._id,productInfo.subCategoryId)}
              className="mb-8 bg-gray-800 p-6 rounded-lg"
            >
              {variant.attributes &&
                typeof variant.attributes === "object" && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4 text-amber-300">Attributes</h4>
                    {Object.entries(variant.attributes).map(
                      ([key, value]) => (
                        <div key={`${variant._id}-${key}`} className="mb-4">
                          <label
                            htmlFor={`${variant._id}-${key}`}
                            className="block text-sm font-medium text-gray-300 mb-1"
                          >
                            {key}:
                          </label>
                          <input
                            type="text"
                            id={`${variant._id}-${key}`}
                            name={key}
                            value={value || ""}
                            onChange={(e) =>
                              handleAttributeChange(
                                variant._id,
                                key,
                                e.target.value
                              )
                            }
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

              <div className="mb-4">
                <label
                  htmlFor={`${variant._id}-quantity`}
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id={`${variant._id}-quantity`}
                  value={variant.quantity}
                  onChange={(e) =>
                    handleVariantChange(
                      variant._id,
                      "quantity",
                      e.target.value
                    )
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor={`${variant._id}-regularPrice`}
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Regular Price:
                </label>
                <input
                  type="number"
                  id={`${variant._id}-regularPrice`}
                  value={variant.regularPrice || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      variant._id,
                      "regularPrice",
                      e.target.value
                    )
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor={`${variant._id}-salePrice`}
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Sale Price:
                </label>
                <input
                  type="number"
                  id={`${variant._id}-salePrice`}
                  value={variant.salePrice || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      variant._id,
                      "salePrice",
                      e.target.value
                    )
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-gray-900 px-4 py-2 rounded-md hover:bg-amber-600 transition-colors font-semibold mt-4"
              >
                Update Variant
              </button>
            </form>
          ))
        ) : (
          <p className="text-gray-400">No variants available.</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default EditProduct;
