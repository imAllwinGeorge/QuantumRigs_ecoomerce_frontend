import React, { useState } from "react";
import axiosInstance from "../../../api/Axios";

const AddBrands = () => {
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async()=>{
   // event.preventDefault();

    //validation

    try {
      const response = await axiosInstance.post('/admin/addbrands',{brand,description});
      if(response.status == 201){
        console.log(response)
      }
    } catch (error) {
      console.log('addbrands',error)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="brand">Brand</label>
        <input
          type="text"
          id="brand"
          value={brand}
          placeholder="Brand"
          name="brand"
          onChange={(e) => setBrand(e.target.value)}
        />
        <label htmlFor="desciption">Brand</label>
        <input
          type="text"
          id="description"
          value={description}
          placeholder="Description"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" >Add Brand</button>
      </form>
    </div>
  );
};

export default AddBrands;
