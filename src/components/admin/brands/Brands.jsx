import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../api/Axios';

const Brands = () => {
  const navigate = useNavigate();
  const [brands,setBrands] = useState([]);


  useEffect(()=>{
    const fetchBrands = async()=>{
      try {
        const response = await axiosInstance.get('/admin/brands');
        console.log(response.data)
        if(response.status === 200){
          setBrands(response.data)
        }
      } catch (error) {
        console.log('fetchUser brands',console.log(error))
      }
    }
    fetchBrands();
  },[])
  return (
    <div>
      <button onClick={()=>navigate('/admin/addbrands')} >Add Brand</button>
      <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Brand</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((brand, index) => (
                            <tr key={brand._id}>
                                <td>{index + 1}</td>
                                <td>{brand.brand}</td>
                                {/* <td>{brand.image}</td> */}
                                
                                <td>
                                    <button
                                        className={`action-btn ${brand.isListed ? 'list-btn' : 'unlist-btn'}`}
                                        onClick={() => {
                                            console.log(brand.iListed)
                                            if (brand.isListed) {
                                                unListBrand(brand._id);
                                            } else {
                                                listBrand(brand._id);
                                            }
                                        }}
                                    >
                                        {brand.isListed ? 'UnList' : 'List'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

    </div>
  )
}

export default Brands