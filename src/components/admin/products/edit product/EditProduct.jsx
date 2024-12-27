import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "../utility/CropImage";
import axiosInstance from "../../../../api/Axios";
import Cropper from "react-easy-crop";

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
        alert("Image deleted");
      }
    } catch (error) {
      console.error("handleDeleteBtn", error);
      alert("Error deleting image: " + error.message);
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
      alert("Error processing image: " + error.message);
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
    async (e, variantId) => {
      e.preventDefault();
      const variantToUpdate = variantInfo.find((v) => v._id === variantId);

      try {
        const response = await axiosInstance.put(
          `/admin/updateVariant/${variantId}`,
          { variantToUpdate }
        );

        if (response.status === 200) {
          alert(`Variant ${variantId} updated successfully`);
          navigate(-1);
        } else {
          throw new Error("Failed to update variant");
        }
      } catch (error) {
        console.error("Error updating variant:", error);
        alert("Error updating variant: " + error.message);
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
        alert("Product edited successfully");
        navigate(-1);
      }
    } catch (error) {
      console.log("handleSubmit", error);
      alert("Error updating product: " + error.message);
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
        alert("Error loading categories and brands: " + error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Images</h2>
        <div className="flex flex-wrap gap-4">
          {productInfo.images.map((image) => (
            <div key={image} className="relative">
              <img
                src={`http://localhost:3000/uploads/images/${image}`}
                alt=""
                className="w-24 h-24 object-cover rounded"
              />
              <button
                onClick={() => handleDeleteBtn(image, productInfo._id)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                type="button"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={productInfo.productName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productInfo.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block mb-1">
            Brand
          </label>
          <select
            id="brand"
            name="brandId"
            value={productInfo.brandId._id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">--Select Brand--</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
            <label htmlFor="subCategory" className="block mb-1">
              Sub-Category
            </label>
            <select
              id="subCategory"
                name='subCategoryId'
              value={productInfo.subCategoryId._id||''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value=''>-- Sub-Category--</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.subCategory}
                </option>
              ))}
            </select>
          </div> */}
        <div>
          <label htmlFor="subCategory" className="block mb-1">
            Sub-Category
          </label>
          <select
            id="subCategory"
            name="subCategoryId"
            value={productInfo.subCategoryId._id} // Pre-select current subCategoryId
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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
          <label htmlFor="productOffer" className="block mb-1">
            Product Offer
          </label>
          <input
            type="text"
            id="productOffer"
            name="productOffer"
            value={productInfo.productOffer}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="productOfferType" className="block mb-1">
            Product Offer Type
          </label>
          <select
            id="productOfferType"
            name="productOfferType"
            value={productInfo.productOfferType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Offer Type --</option>
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Upload Images:</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={images.length >= 3}
            className="w-full p-2 border rounded"
          />
        </div>

        {selectedImage && (
          <div className="mb-4">
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
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Save Cropped Image
            </button>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Uploaded Images:</h3>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Cropped ${index}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Submit
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Variants</h3>

        {variantInfo.length > 0 ? (
          variantInfo.map((variant) => (
            <form
              key={variant._id}
              onSubmit={(e) => handleVariantSubmit(e, variant._id)}
              className="mb-6"
            >
              <div className="border p-4 rounded mb-4">
                {variant.attributes &&
                  typeof variant.attributes === "object" && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Attributes</h4>
                      {Object.entries(variant.attributes).map(
                        ([key, value]) => (
                          <div key={`${variant._id}-${key}`} className="mb-2">
                            <label
                              htmlFor={`${variant._id}-${key}`}
                              className="block mb-1"
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
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}

                <div className="mb-2">
                  <label
                    htmlFor={`${variant._id}-quantity`}
                    className="block mb-1"
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
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-2">
                  <label
                    htmlFor={`${variant._id}-regularPrice`}
                    className="block mb-1"
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
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-2">
                  <label
                    htmlFor={`${variant._id}-salePrice`}
                    className="block mb-1"
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
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Update Variant
              </button>
            </form>
          ))
        ) : (
          <p>No variants available.</p>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
