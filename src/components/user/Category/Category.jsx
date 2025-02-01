import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/Axios';

const Category = () => {

  const [products,setProducts] = useState([]);
  const [subCategories,setCategories] = useState([])

  
  console.log(subCategories.length)


  useEffect(()=>{
    const fetchCategories = async()=>{
      try {
        const response = await axiosInstance.get("/category/products");
        console.log(response)
        if(response.status === 200){
          setProducts(response?.data?.products)
          setCategories(response?.data?.subCategories)
          
        }
      } catch (error) {
        console.log('category filtering',error.message);
        toast(error.response.data)
      }
    }
    fetchCategories();
  },[])
  
  return (
    <div>
        <h1>category</h1>
        {subCategories && subCategories.map((subCategory)=>(
          <>
          <h1 className='text-red-200'>{subCategory}</h1>
          {products.map((product)=>(
            <>
            {subCategory === product?.subCategoryId?.subCategory&&<h1 className='text-black'>{product?.productName}</h1>}
            </>
          ))}
          </>
        ))}
    </div>
  )
}

export default Category