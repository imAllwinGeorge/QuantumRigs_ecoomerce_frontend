import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/Axios';
import { useNavigate } from 'react-router-dom';

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons,setCoupons] = useState([])
  const [triggerFetch,setTriggerFetch] = useState(false)

  const handleDelete = async(couponId)=>{
    
    try {
      const response = await axiosInstance.delete(`/admin/delete-coupon/${couponId}`);
      if(response.status === 200){
        toast(response.data.message)
        setTriggerFetch(state=>!state)
      }
    } catch (error) {
      console.log('delete coupon',error.message);
      toast(error.response.data.message)
    }
  }

  useEffect(()=>{
    const fetchCouponDetails = async()=>{
      try {
        const response = await axiosInstance.get('/admin/get-coupons');
        if(response.status === 200){
          console.log(response)
          setCoupons(response?.data?.coupons)
        }
      } catch (error) {
        console.log("fetch coupons",error);
        toast(error.response.data)
      }
    }
    fetchCouponDetails();
  },[triggerFetch])
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Available Coupons</h1>
          <button 
            onClick={() => navigate("/admin/add-coupon")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Add Coupons
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coupons && coupons.map((coupon) => (
            <div 
              key={coupon._id} 
              className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      Coupon Code: 
                      <span className="ml-2 text-amber-400">{coupon.couponCode}</span>
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm text-gray-300">
                    Offer Value: 
                    <span className="ml-2 text-white font-medium">
                      {coupon.couponOffer}
                      {coupon.couponType === "flat" ? 
                        <span className="ml-1">Flat</span> : 
                        <span className="ml-1">%</span>
                      }
                    </span>
                  </h3>

                  <h3 className="text-sm text-gray-300">
                    Minimum Purchase Amount: 
                    <span className="ml-2 text-white font-medium">
                      {coupon.minPurchaseAmmount}
                    </span>
                  </h3>

                  <h3 className="text-sm text-gray-300">
                    Maximum Discount Amount: 
                    <span className="ml-2 text-white font-medium">
                      {coupon.maxDiscountAmmount}
                    </span>
                  </h3>

                  <h3 className="text-sm text-gray-300">
                    Starting Date: 
                    <span className="ml-2 text-white font-medium">
                      {coupon.startingDate}
                    </span>
                  </h3>

                  <h3 className="text-sm text-gray-300">
                    Expiry Date: 
                    <span className="ml-2 text-white font-medium">
                      {coupon.expiryDate}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button 
                  onClick={()=>handleDelete(coupon._id)} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Coupons