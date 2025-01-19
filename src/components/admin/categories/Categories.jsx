import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import AddSubCategory from "../../admin/categories/AddSubCategory";


const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddSubCategory, setShowAddSubCategory] = useState(null);

  useEffect(() => {
    const fetchCategorie = async () => {
      const response = await axiosInstance.get("/admin/getcategories");
      if (response.data) {
        setCategories(response.data.categories);
      }
    };
    fetchCategorie();
  }, []);

  const toggleCategoryListing = async (categoryId, isListed) => {
    try {
      const response = await axiosInstance.patch(
        "/admin/togglecategorylisting",
        { categoryId }
      );
      if (response.status === 200) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            categoryId === category._id
              ? { ...category, isListed: !isListed }
              : category
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedCategory);
    getSubCategories(selectedCategory);
  };

  const getSubCategories = async (categoryId) => {
    try {
      const response = await axiosInstance.post("/admin/getSubCategories", {
        categoryId,
      });
      if (response.status === 200) {
        setSubCategories(response.data.subCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSubCategoryListing = async(subCategoryId,isListed)=>{
    try {
      const response = await axiosInstance.patch('/admin/subCatogoryToggle',{subCategoryId})
      if(response.status === 200 ){
        setSubCategories((prevSubCategories)=>
        prevSubCategories.map((subCategory)=>
        subCategoryId === subCategory._id?{...subCategory,isListed:!isListed}:subCategory))
      }
    } catch (error) {
      console.log('toggleSubCategory',error)
    }
  }

  const handleShowAddSubCategory = ()=>{
    setShowAddSubCategory(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <button 
            onClick={() => navigate("/admin/addcategory")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md transition-colors"
          >
            Add Category
          </button>
        </div>
        
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-gray-200">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Main Categories</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category Offer </th>
                <th className="p-4">Category Offer Type</th>
                <th className="p-4">Action</th>
                <th className="p-4">Add Sub-Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-700/50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{category.category}</td>
                  <td className="p-4">{category.description}</td>
                  <td className="p-4">{category.categoryOffer}</td>
                  <td className="p-4">{category.categoryOfferType}</td>
                  <td className="p-4 space-x-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        category.isListed 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white transition-colors`}
                      onClick={() => toggleCategoryListing(category._id, category.isListed)}
                    >
                      {category.isListed ? "Unlist" : "List"}
                    </button>
                    <button 
                      className="px-3 py-1 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-gray-900 transition-colors"
                      onClick={() => navigate('/editcategory', {
                        state: {
                          _id: category._id,
                          category: category.category,
                          description: category.description,
                          categoryOffer:category.categoryOffer,
                          categoryOfferType:category.categoryOfferType
                        }
                      })}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-4">
                    <button 
                      className="px-3 py-1 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-gray-900 transition-colors"
                      onClick={() => setShowAddSubCategory(category._id)}
                    >
                      Add Sub-Category
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub Categories Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Sub Categories</h1>
          <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-4">
            <select
              className="bg-gray-700 text-gray-200 rounded-md px-4 py-2 w-full md:w-auto focus:ring-2 focus:ring-amber-500 focus:outline-none"
              name="category"
              id="category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">--select a category--</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
            <button 
              type="submit" 
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md transition-colors"
            >
              Submit
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Sub-Categories</th>
                  <th className="p-4">Offer Value</th>
                  <th className="p-4">Offer Type</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {subCategories.map((subCategory, index) => (
                  <tr key={subCategory._id} className="hover:bg-gray-700/50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{subCategory.subCategory}</td>
                    <td className="p-4">{subCategory.subCategoryOffer}</td>
                    <td className="p-4">{subCategory.subCategoryOfferType}</td>
                    <td className="p-4 space-x-2">
                      <button
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          subCategory.isListed 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white transition-colors`}
                        onClick={() => toggleSubCategoryListing(subCategory._id, subCategory.isListed)}
                      >
                        {subCategory.isListed ? "Unlist" : "List"}
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-gray-900 transition-colors"
                        onClick={() => navigate('/editsubcategory', {
                          state: {
                            _id: subCategory._id,
                            subCategory: subCategory.subCategory,
                            subCategoryOffer: subCategory.subCategoryOffer,
                            subCategoryOfferType: subCategory.subCategoryOfferType,
                            selectedCategory
                          }
                        })}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>

    {/* Add Sub Category Modal */}
    {showAddSubCategory && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <AddSubCategory 
            categoryId={showAddSubCategory} 
            handleShowAddSubCategory={() => setShowAddSubCategory(null)} 
          />
        </div>
      </div>
    )}
  </div>

        
    
  );
};

export default Categories;

