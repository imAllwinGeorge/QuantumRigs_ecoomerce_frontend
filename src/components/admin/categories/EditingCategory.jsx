import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../api/Axios';

const EditingCategory = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const [category,setCategory] = useState(data.category);
    const [description,setDescription] = useState(data.description);
    const [errors,setErrors] = useState({}); 

    const submitForm = async (categoryId)=>{
        try {
            console.log('submitForm',categoryId)
            console.log(category,description)
            const response = await axiosInstance.put('/admin/editcategory',{categoryId,category,description})
            if(response.status === 200){
                navigate(-1)
            }
        } catch (error) {
            console.log('editing category',error)
        }
    }

    const handleSubmit = (event)=>{
        event.preventDefault();
        const newError = {};
        if(!category){
          newError.category = 'category cannot be empty'
        }
        if(!description){
          newError.description = 'description cannot be empty'
        }
        if(Object.keys(newError).length > 0){
          setErrors(newError);
          return;
        }
        submitForm(data._id);
    }
    
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-200"
            >
              Category
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={category}
              id="category"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                transition-colors"
            />
            {errors.category&&<span className="text-red-700" >{errors.category}</span>}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-200"
            >
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter category description"
              value={description}
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                transition-colors resize-none"
            />
            {errors.description&&<span className="text-red-700" >{errors.description}</span>}
          </div>

          <button 
            type="submit"
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md
              transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditingCategory