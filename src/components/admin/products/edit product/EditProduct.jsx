import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "../utility/CropImage";
import axiosInstance from "../../../../api/Axios";
import Cropper from "react-easy-crop";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(location.state.product);
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
    } catch (error) {
      console.error("Error saving cropped image:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

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
        // Replace with your actual API endpoint
        const response = await axiosInstance.put(
          `/admin/updateVariant/${variantId}`,
          {variantToUpdate}
        );

        if (response.status === 200) {
          alert(`Variant ${variantId} updated successfully`);
          navigate(-1)
          // Optionally, update the state with the response data if the server returns updated data
          // setVariantInfo(prevVariants => prevVariants.map(v => v._id === variantId ? response.data : v));
        } else {
          throw new Error("Failed to update variant");
        }
      } catch (error) {
        console.error("Error updating variant:", error);
        // Handle error (e.g., show error message to user)
      }
    },
    [variantInfo]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting:", productInfo);
      // Here you would typically send the updated data to your server
      const response = await axiosInstance.put("/admin/editproduct", {
        productInfo
      });
      console.log(response);
      if (response.status === 200) {
        alert("product editted successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("handleSubmit", error);
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
            name="brand"
            value={productInfo.brand}
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

        <div>
          <label htmlFor="subCategory" className="block mb-1">
            Sub-Category
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={productInfo.subCategory}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Sub-Category--</option>
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
            accept="image/*"
            multiple
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

      <div>
        <h3 className="text-lg font-semibold mb-2">Variants</h3>

        {variantInfo.length > 0 ? (
          variantInfo.map((variant) => (
            <form
              key={variant._id}
              onSubmit={(e) => handleVariantSubmit(e, variant._id)}
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
                Update
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
