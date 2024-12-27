import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { getCroppedImg } from "./utility/CropImage";
import "./Addproducts.css";
import axiosInstance from "../../../api/Axios";
import Variant from "./Variant";

const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brandss, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [subCategoriess, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [productOffer,setProductOffer] = useState('');
  const [productOfferType,setProductOfferType] = useState('');
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
    Cooler: ["Air_coolers", "Liquid_coolers"],
    RAM: ["size", "speed", "type"],
    Storage: ["capacity", "type"],
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

      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);

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
    console.log(productName,description,brandId,subCategoryId)

   
    if (!productName || !description || !brandId || !subCategoryId) {
      setErrors({ form: "All fields are required." });
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("brandId", brandId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("productOffer",productOffer);
    formData.append("productOfferType",productOfferType);

    // images.forEach((image, index) => {
    //   formData.append(`image${index}`, image, `image${index}.jpg`);
    // });
    images.forEach((image, index) => {
      formData.append('images', image); // Same field name as server expects
    });

    // Log formData entries for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axiosInstance.post("/admin/addproduct", formData);
      if (response.status === 201) {
        
        const productDetails = response.data.productDetails;
        console.log(productDetails)
        setProductId(productDetails._id);
        console.log("Product created successfully!");
        // Optionally, show success message
        alert("Product created successfully!");
        
      }
    } catch (error) {
      console.log("Error creating product:", error);
      // Optionally, show an error message to the user
      alert("Error creating product. Please try again.");
    }

  };

  const handleChange = (event,id) => {
    console.log(id)
    const value = event.target.options[event.target.selectedIndex].text;
    
    setSubCategoryId(id)
    
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
    <div>
      <h1>Add Products</h1>
      <form onSubmit={handleSubmit}>
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="subCategories">Sub-Category:</label>
        <select name="subCategory" id="subCategories" onChange={(e)=>handleChange(e,e.target.value)}>
          <option value="">-- Select Sub-Category --</option>
          {subCategoriess.map((subCate) => (
            <option key={subCate._id} value={subCate._id}>
              {subCate.subCategory}
            </option>
          ))}
        </select>

        <label htmlFor="brands">Brands:</label>
        <select
          name="brands"
          id="brands"
          onChange={(e) => setBrandId(e.target.value)}
        >
          <option value="">-- Select Brand --</option>
          {brandss.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.brand}
            </option>
          ))}
        </select>
        <label htmlFor="productOffer">Product Offer</label>
        <input type="text" id="productOffer" placeholder="Product Offer" name="productOffer" value={productOffer} onChange={(e)=>setProductOffer(e.target.value)} />

        <label htmlFor="productOfferType">Product Offer Type</label>
        <select name="productOfferType" id="productOfferType" onChange={(e)=>setProductOfferType(e.target.value)} >
          <option value=""> -- Select Type Offer -- </option>
          <option value="flat">Flat</option>
          <option value="percentage">percentage</option>
        </select>

        <label>Upload Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          disabled={images.length >= 3}
        />

        {selectedImage && (
          <>
            <div className="cropper-container">
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
            <button type="button" onClick={handleSaveCroppedImage}>
              Save Cropped Image
            </button>
          </>
        )}

        <div>
          <h3>Uploaded Images:</h3>
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Cropped ${index}`}
              style={{ width: "100px", height: "100px", margin: "10px" }}
            />
          ))}
        </div>

        {productId ?null:<button type="submit">Submit</button>}
        {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
      </form>

      {productId && variantAttributes.length > 0 && (
        <Variant variantAttributes={variantAttributes} productId={productId} />
      )}
    </div>
  );
};

export default AddProducts;
