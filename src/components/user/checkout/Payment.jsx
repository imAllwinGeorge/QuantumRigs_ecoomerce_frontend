import { CreditCard, Truck, Wallet } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';


const Payment = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState('');
  const location = useLocation();
  const {address} = location.state;
  console.log(address)
  const details = useSelector(state=>state.user)
  console.log(details,'qwertyusdfghjxcvbn')
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'cash-on-delivery', name: 'Cash on Delivery', icon: <Truck className="w-6 h-6" /> },
    { id: 'wallet', name: 'E-Wallet', icon: <Wallet className="w-6 h-6" /> },
  ];

  const handleSubmit = async (event)=>{
    event.preventDefault();
    try {
      if(selectedOption === 'cash-on-delivery'){
        const response = await axiosInstance.post('/order-product',{
          userId:details?.users?.id,
          paymentMethod:'COD',
          totalAmount:details?.cart?.price[1]-details?.cart?.discount,
          shippingAddress:{
            name:address?.name,
            address:address?.address,
            city:address?.city,
            pincode:address?.pincode,
            phone:address?.phone
          },
          items:details?.cart?.productInfo.map((item)=>{
            return{productId:item?.product?._id,variantId:item?.variant?._id,
              quantity:item?.quantity
            }
          }) 
        });
        if(response.status === 200){
          console.log('ordersuccess')
          toast('order placed successfully');
          dispatch(productOrdered())
          na
        }
      }
    } catch (error) {
      console.log('handle payment option',error.message)
      toast(error.response)
    }
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Option</h1>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === method.id
                ? 'bg-blue-50 border-blue-500'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="paymentOption"
              value={method.id}
              checked={selectedOption === method.id}
              onChange={(e)=>setSelectedOption(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className="text-blue-500 mr-3">{method.icon}</div>
              <div>
                <p className="font-medium text-gray-700">{method.name}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
      >
        Proceed to Payment
      </button>
    </form>
  </div>
  )
}

export default Payment