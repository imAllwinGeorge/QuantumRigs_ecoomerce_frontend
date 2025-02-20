import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AddCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categoryOffer,setCategoryOffer] = useState("")
  const [categoryOfferType,setCategoryOfferType] = useState("")
  const [errors,setErrors] = useState({});

  const formValidation = ()=>{
    let newErrors = {};
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const trimmedCategoryOfferType = categoryOfferType.trim();
    
    if(!trimmedCategory){
      newErrors.category = "category feild cannot be empty"
    }
    if(!trimmedDescription){
      newErrors.description = "description cannot be empty"
    }
    if(!trimmedCategoryOfferType){
      newErrors.categoryOfferType = 'category offer cannot be emptyy'
    }
    return newErrors
  }

  const handleCategory = async (event) => {
    event.preventDefault();

    const validation = formValidation();

    if(Object.keys(validation).length > 0){
      setErrors(validation);
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/addcategory", {
        category,
        description,
        categoryOffer,
        categoryOfferType
      });
      if (response.status === 201) {
        setCategory("");
        setDescription("");
        navigate("/admin/categories");
        toast(response.data)
      }
    } catch (error) {
      console.log(error);
      toast(error?.response?.data || "internal sever error")
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Category</h2>
      <form className="space-y-4" onSubmit={handleCategory}>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-1">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={category}
            id="category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            required
          />
          {errors.category&&<span className="text-red-700">{errors.category}</span>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            type="text"
            placeholder="Enter category description"
            value={description}
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            required
          />
          {errors.description&&<span className="text-red-700">{errors.description}</span>}
        </div>

        <div>
        <label htmlFor="categoryoffer" className="block text-sm font-medium text-gray-200 mb-1">
          category Offer
        </label>
        <input
          type="number"
          id="categoryoffer"
          name="categoryOffer"
          value={categoryOffer}
          placeholder="Enter offer amount"
          onChange={(e) => setCategoryOffer(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="categoryOfferType" className="block text-sm font-medium text-gray-200 mb-1">
          Offer Type
        </label>
        <select 
          name="categoryOfferType" 
          id="categoryOfferType" 
          value={categoryOfferType}
          onChange={(e) => setCategoryOfferType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        >
          <option value="">--Select Type--</option>
          <option value="none">None</option>
          <option value="flat">Flat</option>
          <option value="Percentage">Percentage</option>
        </select>
      </div>

        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md
            transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Add Category
        </button>
      </form>
    </div>
  </div>
  );
};

export default AddCategory;

