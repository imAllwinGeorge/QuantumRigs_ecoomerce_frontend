import React from 'react'
import { useSelector } from 'react-redux';

const PriceLayout = ({children}) => {
    const details = useSelector((state) => state.user);
    console.log(details, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    const price = details?.cart?.price;
    const discount = details?.cart?.discount;
    const deliveryCharge = details?.cart?.deliveryCharge
  return (
   
    <div className="flex flex-col md:flex-row min-h-screen">
    <main className="flex-grow md:w-2/3 p-4">{children}</main>
    <aside className="md:w-1/3 p-4">
      {price && (
        <div className="sticky top-6 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Price Details</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <h4>Regular Price</h4>
                <span>₹{price[0].toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <h4>Offer Price</h4>
                <span>₹{price[1].toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <h4>Discount</h4>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <h4>Discount</h4>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Total Price</h1>
              <span className="text-xl font-bold text-gray-800">₹{(price[1] - discount + deliveryCharge).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  </div>
  )
}

export default PriceLayout