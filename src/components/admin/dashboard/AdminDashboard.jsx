
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import axiosInstance from "../../../api/Axios"
import jsPDF from "jspdf"
import "jspdf-autotable" // For creating tables
import * as XLSX from "xlsx"
import SalesChart from "./SalesChart"
import { ChartPieDonut } from "./TopSellers"

const AdminDashboard = () => {
  const user = useSelector((state) => state.user.users)
  const [orderDetails, setOrderDetails] = useState([])
  
  const [topDetails,setTopDetails] = useState({
    brandId
: 
{_id: '', brand: ''},
productName
: 
"",
subCategoryId
: 
{_id: '', subCategory: ''},
_id
: 
""
  })

 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get("/admin/orderDetails")
        if (response.status === 200) {
          const orders = response?.data
            .map((order) => {
              const filteredItems = order?.items.filter((item) => item.status === "Delivered")
              return {
                ...order,
                items: filteredItems,
              }
            })
            .filter((order) => order.items.length > 0)
            console.log(orders)
          setOrderDetails(orders)
          setFilteredOrderDetails(orders) // Set filtered orders initially
        }
      } catch (error) {
        console.log("fetch order details dashboard", error.message)
        toast(error?.response?.data)
      }
    }
    fetchOrderDetails()
  }, [])



  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const chartData = []

  // Group prices by month and year
  const monthYearPriceMap = {}
  orderDetails.forEach((order) => {
    const date = new Date(order.createdAt)
    const year = date.getFullYear()
    const month = monthNames[date.getMonth()]
    const monthYear = `${month} ${year}`

    if (!monthYearPriceMap[monthYear]) {
      monthYearPriceMap[monthYear] = []
    }
    monthYearPriceMap[monthYear].push(order.totalAmount)
  })

  // Calculate average price for each month-year combination
  for (const [monthYear, prices] of Object.entries(monthYearPriceMap)) {
    const total = prices.reduce((sum, price) => sum + price, 0)
    const average = total / prices.length
    const [month, year] = monthYear.split(" ")
    chartData.push({ month: monthYear, sales: average, year: Number.parseInt(year) })
  }

  // Sort the chartData by date
  chartData.sort((a, b) => {
    const dateA = new Date(`${a.month} 1, ${a.year}`)
    const dateB = new Date(`${b.month} 1, ${b.year}`)
    return dateA - dateB
  })

  console.log(chartData)
  
  useEffect(()=>{
    const fetchToplist = async()=>{
      try {
        const response = await axiosInstance.get("/admin/fetchToplist");
      if(response.status === 200){
        console.log('mmmmmbbbhsgysg',response?.data?.topTenDetails);
        setTopDetails(response?.data?.topTenDetails)
      }
      } catch (error) {
        console.log('fetch top list',error);
        toast(error.response.data)
      }
    }
    fetchToplist();
  },[])

  

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <SalesChart chartData={chartData} />
      <ChartPieDonut topDetails={topDetails}/>
    </div>
  )
}

export default AdminDashboard

