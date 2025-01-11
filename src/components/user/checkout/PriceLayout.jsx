import React from 'react'
import { useSelector } from 'react-redux';

const PriceLayout = ({children}) => {
    const details = useSelector((state) => state.user);
    console.log(details, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    const price = details?.cart?.price;
    const discount = details?.cart?.discount;
  return (
    <div>
        <main>
            {children}
        </main>
        <aside>
        {price && (
        <div className="  w-full md:w-1/3 h-fit mt-14  sticky top-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Price Details
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <h4>Regular Price</h4>
                <span>₹{price[0]}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <h4>Offer Price</h4>
                <span>₹{price[1]}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <h4>Discount</h4>
                <span>- ₹{discount}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Total Price</h1>
              <span className="text-xl font-bold text-gray-800">
                ₹{price[1] - discount}
              </span>
            </div>
          </div>
        </div>
      )}
        </aside>
    </div>
  )
}

export default PriceLayout