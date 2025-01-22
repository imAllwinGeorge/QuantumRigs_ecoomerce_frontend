import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/Axios";

const MyOrders = () => {
  const data = useSelector((state) => state.user);
  const user = data?.users;
  const [orderDetails, setOrderDetails] = useState([]);
  const [triggerFetch,setTriggerFetch] = useState(false);


  const handleCancel = async(orderId,productOrderId,paymentMethod,productId,variantId,quantity,userId,totalAmount)=>{
    try {
        const response = await axiosInstance.patch(`/cancel-product`,{orderId,productOrderId,paymentMethod,productId,variantId,quantity,userId,totalAmount});
        if(response.status === 200){
            toast(response?.data?.message);
            setTriggerFetch(state=>!state)
        }
    } catch (error) {
        console.log('cancel product',error.message);
        toast(error?.response?.data);
    }
  }

  const returnProduct = async(orderId,productOrderId,paymentMethod,productId,variantId,quantity,userId,totalAmount)=>{
    try {
      console.log(orderId,productOrderId,paymentMethod,productId,variantId,quantity)
      const response = await axiosInstance.post('/return-product',{orderId,productOrderId,paymentMethod,productId,variantId,quantity,userId,totalAmount});
      if(response.status === 200){
        setTriggerFetch(state=>!state)
        toast(response.data.message)
      }
    } catch (error) {
      console.log('return product',error)
    }
  }
  useEffect(()=>{
    console.log(triggerFetch)
  },[])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/fetch-order-details/${user.id}`
        );
        if (response.status === 200) {
          setOrderDetails(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log("fetch order details", error.message);
        toast(error.response.data);
      }
    };
    fetchOrderDetails();
  }, [triggerFetch]);
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
  {orderDetails &&
    orderDetails.map((item, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            className="w-52 h-52 object-cover border rounded-lg"
            src={`http://localhost:3000/uploads/images/${item?.productId?.images[0]}`}
            alt="image"
          />
        </div>
        
        <div className="flex-grow space-y-3">
          <h1 className="text-lg font-medium text-gray-900">{item?.productId?.productName}</h1>
          <h3 className="text-sm text-gray-600">{item?.productId?.brandId?.brand}</h3>

          <div className="space-y-1">
            {Object.entries(item?.variantId?.attributes).map(([key, value]) => (
              <p className="text-sm text-gray-600" key={key}>
                <span className="font-medium capitalize">{key}</span>: {value}
              </p>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">Quantity: {item?.quantity}</p>

          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
            <div className="space-y-1">
              {Object.entries(item?.shippingAddress).map(([key, value]) => (
                <p className="text-sm text-gray-600" key={key}>
                  <span className="capitalize">{key}</span>: {value}
                </p>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">Payment Method: {item?.paymentMethod}</p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-xl text-gray-900">Status: {item?.status}</p>
            </div>
            
            {item?.status === "Delivered" ? (
              <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
              onClick={()=>{
                let price = item?.quantity * item?.variantId?.salePrice
                returnProduct(item?.orderId,item?.productOrderId,item?.paymentMethod,item?.productId._id,item?.variantId._id,item?.quantity,user.id,price)}}
              >
                Return Product
              </button>
            ) : item?.status === "Cancelled" ? (
              <p className="text-sm font-medium text-red-600">Cancelled Product</p>
            ) : item?.status === "Returned"?<p className="text-sm font-medium text-red-600">Product Returned</p>:(
              <button 
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                onClick={() =>{
                  let price = item?.quantity * item?.variantId?.salePrice
                  handleCancel(item?.orderId,item?.productOrderId,item?.paymentMethod,item?.productId._id,item?.variantId._id,item?.quantity,user.id,price)}}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          
          <div className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Rate & Review Product
          </div>
        </div>
      </div>
    ))}
</div>


  );
};

export default MyOrders;
