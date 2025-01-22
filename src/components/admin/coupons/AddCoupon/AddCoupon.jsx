// import React, { useState } from "react";

// const AddCoupon = () => {
//   const [couponCode, setCouponCode] = useState("");
//   const [description, setDescription] = useState("")
//   const [couponType, setCouponType] = useState('');
//   const [offerValue, setOfferValue] = useState(0)
//   const [minPurchaseAmmount, setMinPurchaseAmmount] = useState(0);
//   const [maxDiscountAmmount, setMaxDiscountAmmount] = useState(0);
//   const [startingDate, setStartingDate] = useState('');
//   const [expiryDate, setExpiryDate] = useState('');

//   const handleSubmit = async()=>{

//   }

//   return (
//     <div>
//       <h1>Add Coupon</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="coupon-code">Coupon Code</label>
//           <input
//             type="text"
//             value={couponCode}
//             placeholder="Coupon Code"
//             id="coupon-code"
//             name="coupon-code"
//             onChange={(e) => setCouponCode(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="description">description</label>
//           <textarea
//             type="text"
//             value={description}
//             placeholder="Coupon Code"
//             id="coupon-code"
//             name="coupon-code"
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="coupon-code">Coupon Type</label>
//          <select name="coupon-type" id="coupon-type" value={couponType} onChange={(e)=>setCouponType(e.target.value)}>
//             <option value=""> --select type--</option>
//             <option value="flat">Flat</option>
//             <option value="percentage">Percentage</option>
//          </select>
//         </div>
//         <div>
//           <label htmlFor="offer-value">offer value</label>
//           <input
//             type="number"
//             value={offerValue}
//             placeholder="Offer Value"
//             id="offer-value"
//             name="offer-value"
//             onChange={(e) => setOfferValue(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="min-purchase-ammount">Minimum purchase ammount</label>
//           <input
//             type="number"
//             value={minPurchaseAmmount}
//             placeholder="Minimum Purchase ammount"
//             id="min-purchase-ammount"
//             name="min-purchase-ammount"
//             onChange={(e) => setMinPurchaseAmmount(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="max-discount-ammount">Maximum purchase ammount</label>
//           <input
//             type="number"
//             value={maxDiscountAmmount}
//             placeholder="Maximum discount ammount"
//             id="max-discount-ammount"
//             name="max-discount-ammount"
//             onChange={(e) => setMaxDiscountAmmount(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="starting-date">Starting date</label>
//           <input
//             type="date"
//             value={startingDate}
//             placeholder="Starting Date"
//             id="starting-data"
//             name="starting date"
//             onChange={(e) => setStartingDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="expiry-date">Expiry Date</label>
//           <input
//             type="date"
//             value={expiryDate}
//             placeholder="Expiry date"
//             id="expiry-date"
//             name="expiry-date"
//             onChange={(e) => setExpiryDate(e.target.value)}
//           />
//         </div>
//         <button type="submit">Add Coupon</button>
//       </form>
//     </div>
//   );
// };

// export default AddCoupon;


import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/Axios";
import { useNavigate } from "react-router-dom";

const AddCoupon = () => {

    const navigate = useNavigate();
    const [couponType, setCouponType] = useState('');

    const couponSchema = Yup.object().shape({
      couponCode: Yup.string()
        .trim('Coupon Code cannot include leading or trailing spaces')
        .required('Coupon Code is required')
        .test('not-only-spaces', 'Coupon Code cannot contain only spaces', value => value && value.trim().length > 0),
      
      description: Yup.string()
        .trim('Description cannot include leading or trailing spaces')
        .required('Description is required')
        .test('not-only-spaces', 'Description cannot contain only spaces', value => value && value.trim().length > 0),
      
      couponType: Yup.string()
        .required('Coupon Type is required'),
      
        couponOffer: Yup.number()
        .required('Offer Value is required')
        .positive('Offer Value must be positive'),
      
      minPurchaseAmmount: Yup.number()
        .required('Minimum Purchase Amount is required')
        .positive('Minimum Purchase Amount must be positive'),
      
    //   maxDiscountAmmount: Yup.number()
    //     .required('Maximum Discount Amount is required')
    //     .positive('Maximum Discount Amount must be positive'),
      
      startingDate: Yup.date()
        .required('Starting Date is required')
        .typeError('Starting Date must be a valid date'),
      
      expiryDate: Yup.date()
        .required('Expiry Date is required')
        .typeError('Expiry Date must be a valid date')
        .min(Yup.ref('startingDate'), 'Expiry Date must be after Starting Date'),
    });
    
  return (
    <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
      <h1 className="text-3xl font-semibold text-white mb-8">Add Coupon</h1>
      <Formik
        initialValues={{
          couponCode: '',
          description: '',
          couponType: '',
          couponOffer: '',
          minPurchaseAmmount: '',
          maxDiscountAmmount: '',
          startingDate: '',
          expiryDate: '',
        }}
        validationSchema={couponSchema}
        onSubmit={async(values) => {
            try {
                const response = await axiosInstance.post('/admin/add-coupon',{values});
                if(response.status === 201){
                    toast('coupon added successfully');
                    navigate(-1)
                }
            } catch (error) {
                console.log('add coupon',error.message);
                toast(error.response.data.message)
            }
        }}
      >
        {({setFieldValue}) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-200 mb-2">
                Coupon Code
              </label>
              <Field
                type="text"
                id="couponCode"
                name="couponCode"
                placeholder="Coupon Code"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="couponCode" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Description"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 h-32"
              />
              <ErrorMessage name="description" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="couponType" className="block text-sm font-medium text-gray-200 mb-2">
                Coupon Type
              </label>
              <Field
                as="select"
                id="couponType"
                name="couponType"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => {
                    const value = e.target.value;
                    setCouponType(value);
                    setFieldValue('couponType', value);
                  }}
              >
                <option value="" className="bg-gray-800">--Select Type--</option>
                <option value="flat" className="bg-gray-800">Flat</option>
                <option value="percentage" className="bg-gray-800">Percentage</option>
              </Field>
              <ErrorMessage name="couponType" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="couponOffer" className="block text-sm font-medium text-gray-200 mb-2">
                Offer Value
              </label>
              <Field
                type="number"
                id="couponOffer"
                name="couponOffer"
                placeholder="Offer Value"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="couponOffer" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="minPurchaseAmmount" className="block text-sm font-medium text-gray-200 mb-2">
                Minimum Purchase Amount
              </label>
              <Field
                type="number"
                id="minPurchaseAmmount"
                name="minPurchaseAmmount"
                placeholder="Minimum Purchase Amount"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="minPurchaseAmmount" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            {couponType === 'percentage' && (<div>
              <label htmlFor="maxDiscountAmmount" className="block text-sm font-medium text-gray-200 mb-2">
                Maximum Discount Amount
              </label>
              <Field
                type="number"
                id="maxDiscountAmmount"
                name="maxDiscountAmmount"
                placeholder="Maximum Discount Amount"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="maxDiscountAmmount" component="div" className="mt-1 text-red-500 text-sm" />
            </div>)}

            <div>
              <label htmlFor="startingDate" className="block text-sm font-medium text-gray-200 mb-2">
                Starting Date
              </label>
              <Field
                type="date"
                id="startingDate"
                name="startingDate"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="startingDate" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-200 mb-2">
                Expiry Date
              </label>
              <Field
                type="date"
                id="expiryDate"
                name="expiryDate"
                className="w-full bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ErrorMessage name="expiryDate" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
            >
              Add Coupon
            </button>
          </Form>
        )}
      </Formik>
    </div>
  </div>
  );
};

export default AddCoupon;
