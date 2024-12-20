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
    editsubCategory();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="subcategory">Sub Category</label>
        <input
          type="text"
          id="subcategory"
          name="subcategory"
          value={subCategory}
          placeholder="Sub-Category"
          onChange={(e) => setSubCategory(e.target.value)}
        />

        <label htmlFor="subcategoryoffer">Sub-category Offer</label>
        <input
          type="number"
          id="subcategoryoffer"
          name="subCategoryOffer"
        value={subCategoryOffer}
          placeholder="subcategoryoffer"
          onChange={(e) => setSubCategoryOffer(e.target.value)}
        />

        <label htmlFor="setCategoryOfferType">Select Offer Type</label>
        <select
          name="setCategoryOfferType"
          id="setcategoryoffertype"
          onChange={(e) => setSubCategoryOfferType(e.target.value)}
        >
          <option value={subCategoryOfferType}>{subCategoryOfferType}</option>
          <option value="Flat">Flat</option>
          <option value="percentage">Percentage</option>
        </select>
        <input type="hidden" id="category" name="category" value={data._Id} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditSubCategory;
