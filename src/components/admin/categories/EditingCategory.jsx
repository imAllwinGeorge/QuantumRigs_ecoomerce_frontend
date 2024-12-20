import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../api/Axios';

const EditingCategory = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const [category,setCategory] = useState(data.category);
    const [description,setDescription] = useState(data.description);

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
        submitForm(data._id);
    }
    
  return (
    <div>
        <form onSubmit={handleSubmit} >
        <label htmlFor="category">Category</label>
        <input
          type="text"
          placeholder="Category"
          value={category}
          id="category"
          name="category"
          onChange={(e) => setCategory(e.target.value)}
        />

        <label htmlFor="description">Description</label>
        <textarea
          rows="4" cols="50"
          type="text"
          placeholder="Description"
          value={description}
          id="description"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type='submit'>Update category</button>
      </form>
    </div>
  )
}

export default EditingCategory