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
    <div className="min-h-screen bg-[#1a1b26] flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#1f2937] rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Add New Brand</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-200">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            placeholder="Brand"
            name="brand"
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-md bg-[#374151] border-transparent placeholder-gray-400 text-white px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 text-sm transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            placeholder="Description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md bg-[#374151] border-transparent placeholder-gray-400 text-white px-4 py-2.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 text-sm transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-md transition duration-200 mt-6"
        >
          Add Brand
        </button>
      </form>
    </div>
  </div>
  );
};

export default AddBrands;
