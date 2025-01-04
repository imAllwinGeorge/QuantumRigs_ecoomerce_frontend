    import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

    const Variant = ({ variantAttributes, productId }) => {
      const Navigate = useNavigate();
    const [attributes, setAttributes] = useState({});
    const [quantity, setQuantity] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [errors,setErrors] = useState({});
    //const [productId, setProductId] = useState(productId);

    const handleInputChange = (attribute, value) => {
        setAttributes((prevAttributes) => ({
        ...prevAttributes,
        [attribute]: value,
        }));
    };

    const handleSubmit = async(event)=>{
      event.preventDefault();
      const newErrors = {};
      if(!attributes){
        newErrors.attributes = "fields cannot be empty"
      }
      if(!quantity){
        newErrors.quantity = 'quantity cannot be empty'
      }
      if(!salePrice){
        newErrors.salePrice = 'sale price cannot be empty'
      }
    if(!regularPrice){
      newErrors.regularPrice = 'regular price cannot be empty'
    }
    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }
        try {
            const response = await axiosInstance.post('/admin/addvariant',{attributes,quantity,regularPrice,salePrice,productId});
            if(response.status === 201){
                toast('successs')
                Navigate('/admin/products')
            }
        } catch (error) {
            console.log('variant adding ',error)
        }

    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mt-8">
  <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800">
    {/* Variant Attributes */}
    {variantAttributes.map((attribute) => (
      <div key={attribute} className="space-y-2">
        <label 
          htmlFor={attribute}
          className="block text-sm font-medium text-gray-300 capitalize"
        >
          {attribute.replace('_', ' ')}:
        </label>
        <input
          type="text"
          id={attribute}
          name={attribute}
          onChange={(e) => handleInputChange(attribute, e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
          placeholder={`Enter ${attribute.replace('_', ' ')}`}
        />
        {errors.attributes&&<span className="text-red-700" >{errors.attributes}</span>}
      </div>
    ))}

    {/* Quantity */}
    <div className="space-y-2">
      <label 
        htmlFor="quantity"
        className="block text-sm font-medium text-gray-300"
      >
        Quantity:
      </label>
      <input
        type="text"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
        placeholder="Enter quantity"
      />
      {errors.quantity&&<span className="text-red-700" >{errors.quantity}</span>}
    </div>

    {/* Regular Price */}
    <div className="space-y-2">
      <label 
        htmlFor="regularPrice"
        className="block text-sm font-medium text-gray-300"
      >
        Regular Price:
      </label>
      <input
        type="number"
        id="regularPrice"
        value={regularPrice}
        onChange={(e) => setRegularPrice(e.target.value)}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
        placeholder="Enter regular price"
      />
      {errors.regularPrice&&<span className="text-red-700" >{errors.regularPrice}</span>}
    </div>

    {/* Sale Price */}
    <div className="space-y-2">
      <label 
        htmlFor="salePrice"
        className="block text-sm font-medium text-gray-300"
      >
        Sale Price:
      </label>
      <input
        type="number"
        id="salePrice"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
        placeholder="Enter sale price"
      />
      {errors.salePrice&&<span className="text-red-700" >{errors.salePrice}</span>}
    </div>

    <button
      type="submit"
      className="w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 font-semibold transition-colors duration-200"
    >
      Submit
    </button>
  </form>
</div>


    );
    };

    export default Variant;
