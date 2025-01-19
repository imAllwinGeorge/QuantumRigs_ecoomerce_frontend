import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";
import { toast } from "react-toastify";


const AddSubCategory = ({ categoryId, handleShowAddSubCategory }) => {
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategoryOffer, setSubCategoryOffer] = useState(0);
  const [subCategoryOfferType, setSubCategoryType] = useState("");
  const [errors,setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    let newErrors = {}
    const trimmedSubCategory = subCategory.trim();
    const trimmedDescription = description.trim();
    


    if(!trimmedSubCategory){
      newErrors.subCategory = "subCategory cannot be empty"
    }
    if(!trimmedDescription){
      newErrors.description = "description cannot be empty"
    }
    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }
    console.log(categoryId);
    addSubCategory(categoryId);
  };

  const addSubCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.post("/admin/addsubcategory", {
        subCategory,
        description,
        subCategoryOffer,
        subCategoryOfferType,
        categoryId,
      });
      if (response.status === 201) {
        handleShowAddSubCategory(null);
        toast(response.data)
      }
    } catch (error) {
      console.log(error);
      toast(error.response.data)
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
    <h4 className="text-2xl font-bold text-white mb-6">Add Sub-Category</h4>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-200 mb-1">
          Sub Category
        </label>
        <button className="bg-red-500 px-5 py-2 rounded-lg" onClick={()=>handleShowAddSubCategory(null)}>X</button>
        <input
          type="text"
          id="subcategory"
          name="subcategory"
          value={subCategory}
          placeholder="Enter sub-category name"
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        />
        {errors.subCategory&&<span className="text-red-700" >{errors.subCategory}</span>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        />
        {errors.description&&<span className="text-red-700" >{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="subcategoryoffer" className="block text-sm font-medium text-gray-200 mb-1">
          Sub-category Offer
        </label>
        <input
          type="number"
          id="subcategoryoffer"
          name="subCategoryOffer"
          value={subCategoryOffer}
          placeholder="Enter offer amount"
          onChange={(e) => setSubCategoryOffer(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="subCategoryOfferType" className="block text-sm font-medium text-gray-200 mb-1">
          Offer Type
        </label>
        <select 
          name="subCategoryOfferType" 
          id="subCategoryOfferType" 
          value={subCategoryOfferType}
          onChange={(e) => setSubCategoryType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
        >
          <option value="">--Select Type--</option>
          <option value="none">None</option>
          <option value="flat">Flat</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      <input type="hidden" id="category" name="category" value={categoryId} />

      <button 
        type="submit" 
        className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md
          transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Add Sub-Category
      </button>
    </form>
  </div>
  );
};

export default AddSubCategory;

