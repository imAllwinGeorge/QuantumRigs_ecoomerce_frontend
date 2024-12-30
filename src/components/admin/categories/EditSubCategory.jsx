import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";

const EditSubCategory = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(data.subCategory);
  const [subCategoryOffer, setSubCategoryOffer] = useState(data.subCategoryOffer);
  const [subCategoryOfferType, setSubCategoryOfferType] = useState(data.subCategoryOfferType);
  const [error,setError] = useState({});

  const editsubCategory = async () => {
    try {
      const response = await axiosInstance.put("/admin/editsubcategory", {
        _id: data._id,
        subCategory,
        subCategoryOffer,
        subCategoryOfferType,
        selectedCategory:data.selectedCategory,
      });
      if(response.status === 200){
        navigate(-1)
      }
    } catch (error) {
      console.log("submitting editsubCategory", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const newError = {};
    if(!subCategory){
      newError.subCategory = 'subcategory cannot be empty'
    }
    if(Object.keys(newError).length > 0){
      setError(newError);
      return;
    }
    editsubCategory();
  };
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8 flex items-start justify-center">
    <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="subcategory" 
            className="block text-sm font-medium text-gray-200"
          >
            Sub Category
          </label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            value={subCategory}
            placeholder="Enter sub-category name"
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
              transition-colors"
          />
          {error.subCategory&&<span className="text-red-700" >{error.subCategory}</span>}
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="subcategoryoffer" 
            className="block text-sm font-medium text-gray-200"
          >
            Sub-category Offer
          </label>
          <input
            type="number"
            id="subcategoryoffer"
            name="subCategoryOffer"
            value={subCategoryOffer}
            placeholder="Enter offer amount"
            onChange={(e) => setSubCategoryOffer(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
              transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="setcategoryoffertype" 
            className="block text-sm font-medium text-gray-200"
          >
            Select Offer Type
          </label>
          <select
            name="setCategoryOfferType"
            id="setcategoryoffertype"
            value={subCategoryOfferType}
            onChange={(e) => setSubCategoryOfferType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
              transition-colors"
          >
            <option value="">Select offer type</option>
            <option value="Flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <input type="hidden" id="category" name="category" value={data._Id} />

        <button 
          type="submit"
          className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md
            transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  );
};

export default EditSubCategory;
