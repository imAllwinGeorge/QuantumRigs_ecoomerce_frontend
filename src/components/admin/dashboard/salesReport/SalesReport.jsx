import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/Axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For creating tables
import * as XLSX from "xlsx";
import Pagination from "../../products/utility/Pagination";

const SalesReport = () => {
  const user = useSelector((state) => state.user.users);
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrderDetails, setFilteredOrderDetails] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    () => parseInt(localStorage.getItem("currentPage")) || 1
  );
  const [postsPerPage, setPostsPerPage] = useState(10);

  const totalRevenue = filteredOrderDetails.reduce(
    (acc, curr) => (acc += curr.totalAmount),
    0
  );
  const totalDiscount = filteredOrderDetails.reduce(
    (acc, curr) => (acc += curr.discount),
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    // 🔹 Add a Title (Centered)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    const title = "Sales Report";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(title, xPosition, 20);

    // 🔹 Add Subtitle - Generated Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // 🔹 Add Revenue & Discount
    doc.setFontSize(12);
    doc.text(`Total Revenue: ${totalRevenue}`, 14, 35);
    doc.text(`Total Discount: ${totalDiscount}`, 100, 35);

    // 🔹 Define Table Columns
    const tableColumn = [
      "Index",
      "Date",
      "Order ID",
      "Product Name",
      "User Name",
      "Total Amount",
      "Discount",
    ];

    // 🔹 Prepare Table Rows
    const tableRows = filteredOrderDetails.map((order, index) => {
      const productNames = order.items
        .map((item) => {
          return Array.isArray(item.productDetails)
            ? item.productDetails
                .map((product) => product.productName)
                .join(", ")
            : item.productDetails?.productName || "N/A";
        })
        .join(", ");

      return [
        index + 1,
        order.createdAt.split("T")[0],
        order._id,
        productNames,
        order.userName,
        order.totalAmount,
        order.discount,
      ];
    });

    // 🔹 Add Order Details Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    // 🔹 Add Revenue & Discount Table
    const summaryTableColumn = ["Total Revenue", "Total Discount"];
    const summaryTableRow = [[totalRevenue, totalDiscount]];

    doc.autoTable({
      head: [summaryTableColumn],
      body: summaryTableRow,
      startY: doc.lastAutoTable.finalY + 10, // Add spacing after first table
    });

    // 🔹 Save the PDF
    doc.save("sales_report.pdf");
  };

  const generateExcel = () => {
    // Define your data structure
    const data = filteredOrderDetails.map((order, index) => ({
      Index: index + 1,
      Date: order.createdAt.split("T")[0],
      OrderId: order._id,
      ProductNames: order.items
        .map((item) => item.productDetails.productName)
        .join(", "), // Combine product names into a single string
      UserName: order.userName,
      TotalAmount: order.totalAmount,
      Discount: order.discount,
    }));

    // Append a blank row for spacing
    data.push({
      Index: "",
      Date: "",
      OrderId: "",
      ProductNames: "",
      UserName: "——",
      TotalAmount: "",
      Discount: "",
    });

    // Append Total Revenue and Total Discount row
    data.push({
      Index: "Total Revenue",
      Date: "",
      OrderId: totalRevenue,
      ProductNames: "",
      UserName: "Total Discount",
      TotalAmount: "",
      Discount: totalDiscount,
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  const filterOrders = (type, start = null, end = null) => {
    let filtered;
    const now = new Date();

    const startOfDay = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const endOfDay = (date) => {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
    };

    switch (type) {
      case "1day":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filtered = orderDetails.filter(
          (order) =>
            new Date(order.createdAt) >= startOfDay(yesterday) &&
            new Date(order.createdAt) <= endOfDay(now)
        );
        break;
      case "1week":
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = orderDetails.filter(
          (order) =>
            new Date(order.createdAt) >= startOfDay(lastWeek) &&
            new Date(order.createdAt) <= endOfDay(now)
        );
        break;
      case "1month":
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = orderDetails.filter(
          (order) =>
            new Date(order.createdAt) >= startOfDay(lastMonth) &&
            new Date(order.createdAt) <= endOfDay(now)
        );
        break;
      case "custom":
        if (start && end) {
          filtered = orderDetails.filter(
            (order) =>
              new Date(order.createdAt) >= startOfDay(new Date(start)) &&
              new Date(order.createdAt) <= endOfDay(new Date(end))
          );
        } else {
          filtered = orderDetails;
        }
        break;
      default:
        filtered = orderDetails;
    }

    setFilteredOrderDetails(filtered);
    setFilterType(type);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get("/admin/orderDetails");
        if (response.status === 200) {
          const orders = response?.data
            .map((order) => {
              const filteredItems = order?.items.filter(
                (item) => item.status === "Delivered"
              );
              return {
                ...order,
                items: filteredItems,
              };
            })
            .filter((order) => order.items.length > 0);
          console.log(orders);
          setOrderDetails(orders);
          setFilteredOrderDetails(orders); // Set filtered orders initially
        }
      } catch (error) {
        console.log("fetch order details dashboard", error.message);
        toast(error.response.data);
      }
    };
    fetchOrderDetails();
  }, []);
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
    return () => {
      localStorage.removeItem("currentPage"); // Remove when component unmounts
    };
  }, [currentPage]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredOrderDetails.slice(
    firstPostIndex,
    lastPostIndex
  );

  const FilterComponent = () => {
    return (
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-white text-xl mb-4">Filter Orders</h2>
        <div className=" flex flex-wrap justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => filterOrders("all")}
              className={`px-4 py-2 rounded ${
                filterType === "all" ? "bg-blue-500" : "bg-slate-700"
              } text-white`}
            >
              All
            </button>
            <button
              onClick={() => filterOrders("1day")}
              className={`px-4 py-2 rounded ${
                filterType === "1day" ? "bg-blue-500" : "bg-slate-700"
              } text-white`}
            >
              1 Day
            </button>
            <button
              onClick={() => filterOrders("1week")}
              className={`px-4 py-2 rounded ${
                filterType === "1week" ? "bg-blue-500" : "bg-slate-700"
              } text-white`}
            >
              1 Week
            </button>
            <button
              onClick={() => filterOrders("1month")}
              className={`px-4 py-2 rounded ${
                filterType === "1month" ? "bg-blue-500" : "bg-slate-700"
              } text-white`}
            >
              1 Month
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (new Date(selectedDate) <= new Date(endDate || new Date())) {
                  setStartDate(selectedDate);
                } else {
                  alert("Start date cannot be after the end date");
                }
              }}
              max={endDate || new Date().toISOString().split("T")[0]} // Max date set to end date or today
              className="bg-slate-700 text-white px-2 py-1 rounded"
            />
            <span className="text-white">to</span>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (new Date(selectedDate) >= new Date(startDate || 0)) {
                  setEndDate(selectedDate);
                } else {
                  alert("End date cannot be before the start date");
                }
              }}
              min={startDate || ""}
              max={new Date().toISOString().split("T")[0]} // Max date set to today
              className="bg-slate-700 text-white px-2 py-1 rounded"
            />
            <button
              onClick={() => filterOrders("custom", startDate, endDate)}
              className={`px-4 py-2 rounded ${
                filterType === "custom" ? "bg-blue-500" : "bg-slate-700"
              } text-white`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-white text-3xl font-extrabold text-center  mb-4">
        Sales Report
      </h1>
      <FilterComponent />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-slate-400 text-sm mb-2">Total Orders</h3>
          <h1 className="text-white text-2xl font-semibold">
            {filteredOrderDetails.length}
          </h1>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-slate-400 text-sm mb-2">Order Revenue</h3>
          <h1 className="text-white text-2xl font-semibold">{totalRevenue}</h1>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-slate-400 text-sm mb-2">Discount Given</h3>
          <h1 className="text-white text-2xl font-semibold">{totalDiscount}</h1>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-4 text-slate-400 font-medium">
                index
              </th>
              <th className="text-left p-4 text-slate-400 font-medium">Date</th>
              <th className="text-left p-4 text-slate-400 font-medium">
                orderId
              </th>
              <th className="text-left p-4 text-slate-400 font-medium">
                product name
              </th>
              <th className="text-left p-4 text-slate-400 font-medium">
                user name
              </th>
              <th className="text-left p-4 text-slate-400 font-medium">
                total amount
              </th>
              <th className="text-left p-4 text-slate-400 font-medium">
                discount
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPosts &&
              currentPosts.map((order, index) => (
                <tr key={order._id} className="border-b border-slate-700">
                  <td className="p-4 text-white">{index + 1}</td>
                  <td className="p-4 text-white">
                    {order.createdAt.split("T")[0]}
                  </td>
                  <td className="p-4 text-white">{order._id}</td>
                  <td className="p-4 text-white">
                    {order.items
                      .map((item) => item.productDetails.productName)
                      .join(", ")}
                  </td>
                  <td className="p-4 text-white">{order.userName}</td>
                  <td className="p-4 text-white">{order.totalAmount}</td>
                  <td className="p-4 text-white">{order.discount}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-between p-4">
          <button
            onClick={generatePDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Download as PDF
          </button>
          <button
            onClick={generateExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Download Excel
          </button>
        </div>
      </div>
      <Pagination
        totalPosts={filteredOrderDetails.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default SalesReport;
