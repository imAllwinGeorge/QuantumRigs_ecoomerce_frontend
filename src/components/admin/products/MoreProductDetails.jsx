import React, { useEffect } from 'react'
import axiosInstance from '../../../api/Axios'
import { useLocation } from 'react-router-dom'

const MoreProductDetails = ({productId}) => {
    const location = useLocation();
    const data = location.state;
    console.log(data)

    useEffect(()=>{
        console.log(productId)
        const fetchMoreDetails =  async()=>{
            const response = await axiosInstance.get(`/admin/moreprodctdetails/${productId}`)
            console.log(response)
            if(response.status === 200){
                console.log('yahhh')
            }
        }
        fetchMoreDetails();
    },[])
  return (
    <div>
<h1>More Details</h1>
    </div>
  )
}

export default MoreProductDetails