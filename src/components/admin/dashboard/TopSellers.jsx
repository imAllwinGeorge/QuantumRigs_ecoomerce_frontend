import React, { useMemo, useState } from "react";
import { Pie, PieChart, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ChartTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black text-white p-2 shadow-lg rounded-md border border-gray-500">
        <p className="font-semibold">{data.name}</p>
        <p>{`Count: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartComponent = ({ data, title }) => (
    <div className="p-4 bg-black text-white rounded-lg shadow-md flex flex-col items-center">
    <h2 className="text-lg font-bold text-center mb-4">{title}</h2>
    <div className="flex justify-center items-center">
        <PieChart width={300} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
        <Legend align="right" verticalAlign="middle" layout="vertical" />
    </div>
</div>
);

export function ChartPieDonut({ topDetails }) {
  const [chartType, setChartType] = useState("productName");

  const processData = (data, key) => {
    if (!Array.isArray(data)) return [];

    const processedData = data.reduce((acc, item) => {
      const details = item?.productDetails?.[key];
      let name = "Unknown";
      if (typeof details === "string") {
        name = details;
      } else if (typeof details === "object" && details !== null) {
        name = details.brand || details.subCategory || "Unknown";
      }
      acc[name] = (acc[name] || 0) + (item.count || 0);
      return acc;
    }, {});

    return Object.entries(processedData).map(([name, value]) => ({ name, value }));
  };

  const chartData = useMemo(() => processData(topDetails, chartType), [topDetails, chartType]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setChartType("productName")}>
          Top Products
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => setChartType("brandId")}>
          Top Brands
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setChartType("subCategoryId")}>
          Top Subcategories
        </button>
      </div>
      <PieChartComponent data={chartData} title={
        chartType === "productName" ? "Top Products" :
        chartType === "brandId" ? "Top Brands" :
        "Top Subcategories"
      } />
    </div>
  );
}
