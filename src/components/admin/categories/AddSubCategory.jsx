import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";
import "./AddSubCategory.css";

const AddSubCategory = ({ categoryId, handleShowAddSubCategory }) => {
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategoryOffer, setSubCategoryOffer] = useState(0);
  const [subCategoryOfferType, setSubCategoryType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
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
        handleShowAddSubCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-sub-category-container">
      <h4 className="add-sub-category-title">SubCategory</h4>
      <form onSubmit={handleSubmit} className="add-sub-category-form">
        <div className="form-group">
          <label htmlFor="subcategory" className="form-label">Sub Category</label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            value={subCategory}
            placeholder="Sub-Category"
            onChange={(e) => setSubCategory(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subcategoryoffer" className="form-label">Sub-category Offer</label>
          <input
            type="number"
            id="subcategoryoffer"
            name="subCategoryOffer"
            value={subCategoryOffer}
            placeholder="Sub-category offer"
            onChange={(e) => setSubCategoryOffer(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subCategoryOfferType" className="form-label">Offer Type</label>
          <select 
            name="subCategoryOfferType" 
            id="subCategoryOfferType" 
            onChange={(e) => setSubCategoryType(e.target.value)}
            className="form-select"
          >
            <option value="">--Select Type--</option>
            <option value="Flat">Flat</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>

        <input type="hidden" id="category" name="category" value={categoryId} />

        <button type="submit" className="submit-btn">Add Sub-Category</button>
      </form>
    </div>
  );
};

export default AddSubCategory;

