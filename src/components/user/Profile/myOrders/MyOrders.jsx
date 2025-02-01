import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/Axios";
import MessageBox from "./MessageBox";
import jsPDF from "jspdf"
import "jspdf-autotable" // For creating tables
import { useRazorpay } from "react-razorpay";
import { productOrdered } from "../../../../redux/userSlice";

const MyOrders = () => {
  const data = useSelector((state) => state.user);
  const user = data?.users;
  console.log("mnbvcxz",user)
  const [orderDetails, setOrderDetails] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdetifier] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const Razorpay = useRazorpay();
  const dispatch = useDispatch();
  const [handleOrder, setHandleOrder] = useState({
    orderId: "",
    productOrderId: "",
    paymentMethod: "",
    productId: "",
    variantId: "",
    quantity: 0,
    userId: "",
    totalAmount: 0,
    price: 0,
  });
  


  // const generatePDF = (order) => {
  //     const doc = new jsPDF()
  //     console.log("sssssssssssssssdddddddddddddd",order)
  //     // Add a title
  //     doc.setFont("helvetica", "bold") // Set the font to bold
  //     doc.setFontSize(22)
  
  //     const title = "Invoice"
  //     const pageWidth = doc.internal.pageSize.getWidth() // Get the page width
  //     const textWidth = doc.getTextWidth(title) // Get the width of the text
  //     const xPosition = (pageWidth - textWidth) / 2 // Calculate the x position for centering
  
  //     doc.text(title, xPosition, 20) // Add the text at the calculated position
  
  //     // Add a subtitle
  //     doc.setFontSize(12)
  //     doc.text(`Invoice date: ${new Date().toLocaleDateString()}`, 14, 30)
  //     doc.text(`Order date: ${order?.orderDate.split("T")[0]}`, 14, 35)
  //     const shippingAddress =  Object.values(order.shippingAddress).join(", ")
  //     console.log(shippingAddress)
  //     // Add table
  //     const tableColumn = ["Order ID", "Shipping Address", "Billing Address"]
  //     // Prepare table rows
     
  //       // Collect all product names in a single string
  //       // const shippingAddress = Object.values()
  //       const tableRows = [
          

  //         [order.productId._id,
  //         shippingAddress,
  //         shippingAddress]

  //       ]
   
  
  //     doc.autoTable({
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 40,
  //     })



  //     const secondTableStartY = doc.autoTable.previous.finalY + 10;

  //     // Second Table
  //     const tableColumn2 = ["Product", "Quantity", "Price" , "offerPrice" ,"Total Price" , "discount" , "final Price"];
  //     const tableRows2 = [
  //       [order?.productId?.productName,
  //       order?.quantity,
  //       order?.variantId?.regularPrice,
  //       order?.variantId?.salePrice,
  //       order?.variantId?.salePrice * order?.quantity,
  //       order?.discount,
  //       order?.totalAmount]
  //     ]
    
  //     doc.autoTable({
  //       head: [tableColumn2],
  //       body: tableRows2,
  //       startY: secondTableStartY,
  //     });
    
  
  //     // Save the PDF
  //     doc.save("Invoice.pdf")
  //   }


  const generatePDF = (order) => {
    const doc = new jsPDF();
    console.log("Order Details:", order);
  
    // Add a title
    doc.setFont("helvetica", "bold"); // Set the font to bold
    doc.setFontSize(22);
  
    const title = "Invoice";
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width
    const textWidth = doc.getTextWidth(title); // Get the width of the text
    const xPosition = (pageWidth - textWidth) / 2; // Calculate the x position for centering
  
    doc.text(title, xPosition, 20); // Add the text at the calculated position
  
    // Add invoice and order dates
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Order Date: ${order?.orderDate.split("T")[0]}`, 14, 35);
  
    // Prepare and format the shipping address
    const shippingAddress = Object.values(order.shippingAddress).join(", ");
    console.log("Shipping Address:", shippingAddress);
  
    // First Table: Order Details
    const tableColumn = ["Order ID", "Shipping Address", "Billing Address"];
    const tableRows = [
      [order.productId._id, shippingAddress, shippingAddress],
    ];
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
    });
  
    // Position for the second table
    const secondTableStartY = doc.autoTable.previous.finalY + 10;
  
    // Second Table: Product Details
    const tableColumn2 = [
      "Product",
      "Quantity",
      "Price",
      "Offer Price",
      "Total Price",
      "Discount",
      "Final Price",
    ];
    const tableRows2 = [
      [
        order?.productId?.productName,
        order?.quantity,
        order?.variantId?.regularPrice,
        order?.variantId?.salePrice,
        order?.variantId?.salePrice * order?.quantity,
        order?.discount,
        order?.totalAmount,
      ],
    ];
  
    doc.autoTable({
      head: [tableColumn2],
      body: tableRows2,
      startY: secondTableStartY,
      theme: "grid",
    });
  
    // Add total price below the second table
    const totalPriceY = doc.autoTable.previous.finalY + 10; // Position below the second table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: ${order.totalAmount}`, pageWidth - 60, totalPriceY); // Right-aligned
  
    // Save the PDF
    doc.save("Invoice.pdf");
  };
  
  

  const onClose = ()=>{
    setShowMessageBox(false)
    setTriggerFetch(state=>!state)
  }

  const handleCancel = async (
    orderId,
    productOrderId,
    paymentMethod,
    productId,
    variantId,
    quantity,
    userId,
    totalAmount,
    price
  ) => {
    setHandleOrder({
      orderId,
      productOrderId,
      paymentMethod,
      productId,
      variantId,
      quantity,
      userId,
      totalAmount,
      price,
    });

   
  };
  

  const returnProduct = async (
    orderId,
    productOrderId,
    paymentMethod,
    productId,
    variantId,
    quantity,
    userId,
    totalAmount,
    price
  ) => {
    setHandleOrder({
      orderId,
      productOrderId,
      paymentMethod,
      productId,
      variantId,
      quantity,
      userId,
      totalAmount,
      price,
    });
    
  };
  
  const changePaymentStatus = async(orderId)=>{
    try {
      const response = await axiosInstance.patch(`/change-payment-status/${orderId}`);
      if(response.status === 200){
        console.log("paymentDone");
        // toast("payment Done")
        setTriggerFetch(state=>!state)
      }
    } catch (error) {
      console.log('change payment status',error)
    }
  }

  const handleTryagain = async(event,totalAmount,orderId)=>{
    event.preventDefault();
    try {
      
      setLoading(true);
      console.log("ordersuccess");
      const { data } = await axiosInstance.post(
        "/api/payment/create-order",
        {
          amount: totalAmount,
          currency: "INR",
          receipt: user.id,
        }
      );

      const options = {
        key: "rzp_test_YSUyXhKfvmy5Tq",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Quantum_Rigs",
        description: "Test Transaction",
        order_id: data.order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        handler: async (response) => {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyResponse = await axiosInstance.post(
            "/api/payment/verify-payment",
            paymentData
          );

          if (verifyResponse.data.success) {
            console.log("ordersuccess");
            toast(response?.data?.message);
            dispatch(productOrdered());
            changePaymentStatus(orderId)
            // navigate("/order-summery", {
            //   state: { orderDetails: response?.data?.orderProduct },
            // });
          } else {
            toast("Payment verification failed.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        console.error("Razorpay SDK is not loaded.");
        toast(
          "Payment gateway is not available. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast("Error initiating payment. Please try again.");
    }finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    console.log(triggerFetch);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/fetch-order-details/${user.id}`
        );
        if (response.status === 200) {
          setOrderDetails(response.data);
          console.log('orderDetails consoled',response.data);
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
      {showMessageBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <MessageBox orderDetails={handleOrder} identifier={identifier} onClose={onClose} />
      </div>
      )}
      {orderDetails &&
        orderDetails.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-shrink-0">
              <img
                className="w-52 h-52 object-cover border rounded-lg"
                src={`http://localhost:3000/uploads/images/${item?.productId?.images[0]}`}
                alt="image"
              />
            </div>

            <div className="flex-grow space-y-3">
              <h1 className="text-lg font-medium text-gray-900">
                {item?.productId?.productName}
              </h1>
              <h3 className="text-sm text-gray-600">
                {item?.productId?.brandId?.brand}
              </h3>

              <div className="space-y-1">
                {Object.entries(item?.variantId?.attributes).map(
                  ([key, value]) => (
                    <p className="text-sm text-gray-600" key={key}>
                      <span className="font-medium capitalize">{key}</span>:{" "}
                      {value}
                    </p>
                  )
                )}
              </div>

              <p className="text-sm text-gray-600">
                Quantity: {item?.quantity}
              </p>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </h4>
                <div className="space-y-1">
                  {Object.entries(item?.shippingAddress).map(([key, value]) => (
                    <p className="text-sm text-gray-600" key={key}>
                      <span className="capitalize">{key}</span>: {value}
                    </p>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Payment Method: {item?.paymentMethod}
              </p>

              <p className="text-sm text-gray-600">
                Payment Status: {item?.paymentStatus}
              </p>

              {item?.paymentMethod === "online" && item?.paymentStatus === "pending"? <button onClick={()=>handleTryagain(event,item?.totalAmount,item?.orderId)} className="bg-green-300 py-1 px-3 rounded-md font-bold">Try again</button>:null}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-xl text-gray-900">
                    Status: {item?.status}
                  </p>
                </div>

                {item?.status === "Delivered" ? (
                  <button
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                    onClick={() => {
                      let price = item?.quantity * item?.variantId?.salePrice;
                      setShowMessageBox(true);
                      returnProduct(
                        item?.orderId,
                        item?.productOrderId,
                        item?.paymentMethod,
                        item?.productId._id,
                        item?.variantId._id,
                        item?.quantity,
                        user.id,
                        price
                      );
                    }}
                  >
                    Return Product
                  </button>
                ) : item?.status === "Cancelled" ? (
                  <p className="text-sm font-medium text-red-600">
                    Cancelled Product
                  </p>
                ) : item?.status === "Returned" ? (
                  <p className="text-sm font-medium text-red-600">
                    Product Returned
                  </p>
                ) : (
                  <button
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    onClick={() => {
                      let price = item?.quantity * item?.variantId?.salePrice;
                      setIdetifier(true);
                      setShowMessageBox(true);
                      handleCancel(
                        item?.orderId,
                        item?.productOrderId,
                        item?.paymentMethod,
                        item?.productId._id,
                        item?.variantId._id,
                        item?.quantity,
                        user.id,
                        price
                      );
                    }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
            <div className="text-black">
              
              <button className="bg-slate-300 py-1 px-4 rounded-md" onClick={()=>generatePDF(item)} >download</button>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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
