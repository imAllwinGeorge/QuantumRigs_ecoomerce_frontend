import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";
import { useNavigate } from "react-router-dom";
import "./AddCategory.css";

const AddCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleCategory = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/admin/addcategory", {
        category,
        description,
      });
      if (response.status === 201) {
        setCategory("");
        setDescription("");
        navigate("/admin/categories");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-category-container">
      <h2 className="add-category-title">Add New Category</h2>
      <form className="add-category-form" onSubmit={handleCategory}>
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            id="category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-btn">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;

