import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const SalesChart = ({ chartData }) => {
  const [chartDataSet, setChartDataSet] = useState(null)
  const [viewType, setViewType] = useState("monthly")

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const monthOrder = [
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

      // Sort data chronologically
      const sortedData = [...chartData].sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA - dateB
      })

      // Prepare monthly data
      const monthlyLabels = sortedData.map((item) => item.month)
      const monthlySales = sortedData.map((item) => item.sales)

      // Prepare yearly data
      const yearlyData = sortedData.reduce((acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = { year: item.year, sales: 0, count: 0 }
        }
        acc[item.year].sales += item.sales
        acc[item.year].count += 1
        return acc
      }, {})

      const yearlyLabels = Object.keys(yearlyData).sort()
      const yearlySales = yearlyLabels.map((year) => yearlyData[year].sales / yearlyData[year].count)

      setChartDataSet({
        labels: viewType === "monthly" ? monthlyLabels : yearlyLabels,
        datasets: [
          {
            label: viewType === "monthly" ? "Monthly Sales" : "Yearly Sales",
            data: viewType === "monthly" ? monthlySales : yearlySales,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            tension: 0.1,
          },
        ],
      })
    }
  }, [chartData, viewType])

  if (!chartDataSet) return <p>Loading chart...</p>

  return (
    <div className="chart-container">
      <div className="mb-4">
        <button
          onClick={() => setViewType("monthly")}
          className={`mr-2 px-4 py-2 rounded ${viewType === "monthly" ? "bg-amber-500 text-white" : "bg-amber-700"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewType("yearly")}
          className={`px-4 py-2 rounded ${viewType === "yearly" ? "bg-amber-500 text-white" : "bg-amber-700"}`}
        >
          Yearly
        </button>
      </div>
      <Line
        data={chartDataSet}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Sales Data",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}

export default SalesChart

