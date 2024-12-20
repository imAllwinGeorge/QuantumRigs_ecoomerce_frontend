import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import AddSubCategory from "../../admin/categories/AddSubCategory";
import "./Categories.css";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);

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
    setShowAddSubCategory(false)
  }

  return (
    <div className="categories-container">
      <div className="categories-section">
        <div className="categories-header">
          <h1 className="categories-title">Categories</h1>
          <button className="add-category-btn" onClick={() => navigate("/admin/addcategory")}>
            Add Category
          </button>
        </div>
        <table className="categories-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Main Categories</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.category}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className={`action-btn ${category.isListed ? 'unlist-btn' : 'list-btn'}`}
                    onClick={() =>
                      toggleCategoryListing(category._id,category.isListed)
                    }
                  >
                    {category.isListed ? "unList" : "List"}
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={()=>navigate('/editcategory',{state:{_id:category._id,category:category.category,description:category.description}})}
                  >
                    Edit Category
                  </button>
                </td>
                <td>
                  <button 
                    className="action-btn add-sub-btn"
                    onClick={() => setShowAddSubCategory(true)}
                  >
                    Add Sub-Category
                  </button>
                  {showAddSubCategory ? (
                    <AddSubCategory categoryId={category._id} handleShowAddSubCategory={handleShowAddSubCategory} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sub-categories-section">
        <h1 className="sub-categories-title">Sub Categories</h1>
        <form onSubmit={handleSubmit} className="sub-categories-form">
          <select
            className="category-select"
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
          <button type="submit" className="submit-btn">submit</button>
        </form>
      </div>

      <table className="sub-categories-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Sub-Categories</th>
            <th>Offer Value</th>
            <th>Offer Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.map((subCategory, index) => (
            <tr key={subCategory._id}>
              <td>{index + 1}</td>
              <td>{subCategory.subCategory}</td>
              <td>{subCategory.subCategoryOffer}</td>
              <td>{subCategory.subCategoryOfferType}</td>
              <td>
                <button
                  className={`action-btn ${subCategory.isListed ? 'unlist-btn' : 'list-btn'}`}
                  onClick={()=>toggleSubCategoryListing(subCategory._id,subCategory.isListed)}
                >
                  {subCategory.isListed ? "unList" : "List"}
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={()=>navigate('/editsubcategory',{state:{_id:subCategory._id,
                    subCategory:subCategory.subCategory,
                    subCategoryOffer:subCategory.subCategoryOffer,
                    subCategoryOfferType:subCategory.subCategoryOfferType,
                    selectedCategory
                  }})}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;

