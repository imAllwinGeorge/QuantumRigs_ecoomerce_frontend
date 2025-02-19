'use client'

import React, { useState, useEffect, useRef, useCallback } from "react"

const Filters = ({ brandDetails, onFilterChange }) => {
  const [minValue, setMinValue] = useState(() => {
    return Number(localStorage.getItem("minValue")) || 20
  })
  const [maxValue, setMaxValue] = useState(() => {
    return Number(localStorage.getItem("maxValue")) || 300000
  })
  const [selectedFilters, setSelectedFilters] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedFilters") || "[]")
  })
  const [selectedSorts, setSelectedSorts] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedSorts") || "[]")
  })
  const [selectedBrands, setSelectedBrands] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedBrands") || "[]")
  })

  const minValRef = useRef(minValue)
  const maxValRef = useRef(maxValue)
  const range = useRef(null)

  const getPercent = useCallback(
    (value) => Math.round(((value - 20) / (300000 - 20)) * 100),
    []
  )

  useEffect(() => {
    const minPercent = getPercent(minValue)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minValue, getPercent])

  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxValue)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxValue, getPercent])

  useEffect(() => {
    localStorage.setItem("minValue", minValue)
    localStorage.setItem("maxValue", maxValue)
    localStorage.setItem("selectedFilters", JSON.stringify(selectedFilters))
    localStorage.setItem("selectedSorts", JSON.stringify(selectedSorts))
    localStorage.setItem("selectedBrands", JSON.stringify(selectedBrands))

    if (typeof onFilterChange === 'function') {
      onFilterChange({
        priceRange: { min: minValue, max: maxValue },
        filters: selectedFilters,
        sorts: selectedSorts,
        brands: selectedBrands
      })
    }
    console.log("lkjhghfg",minValue)
  }, [minValue, maxValue, selectedFilters, selectedSorts, selectedBrands, onFilterChange])

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1)
    setMinValue(value)
    console.log("kkkkkkkkkkkk",value)
    minValRef.current = value
    console.log("kdh",minValue)
  }

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1)
    setMaxValue(value)
    maxValRef.current = value
  }

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    )
  }

  const toggleSort = (sort) => {
    setSelectedSorts((prev) =>
      prev.includes(sort)
        ? prev.filter((item) => item !== sort)
        : [sort] // Only allow one sort option at a time
    )
  }

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    )
  }

  return (
    <aside className="w-64 p-6 bg-white shadow-md rounded-lg">
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <ul className="space-y-2">
          {["Popularity", "New arrivals", "Average Ratings", "Featured"].map(
            (filter) => (
              <li key={filter}>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    onChange={() => toggleFilter(filter)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    {filter}
                  </span>
                </label>
              </li>
            )
          )}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Price</h2>
        <div className="relative h-2 mb-12">
          <input
            type="range"
            min="20"
            max="300000"
            value={minValue}
            onChange={handleMinChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
          />
          <input
            type="range"
            min="20"
            max="300000"
            value={maxValue}
            onChange={handleMaxChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
          />
          <div className="absolute w-full h-2 bg-gray-200 rounded z-10"></div>
          <div ref={range} className="absolute h-2 bg-teal-500 rounded z-20"></div>
          <div className="absolute bottom-[-30px] left-0 text-sm text-gray-600">₹{minValue.toLocaleString()}</div>
          <div className="absolute bottom-[-30px] right-0 text-sm text-gray-600">₹{maxValue.toLocaleString()}</div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sorting</h2>
        <ul className="space-y-2">
          {["aA - zZ", "zZ - aA", "Price: Low to High", "Price: High to Low"].map((sort) => (
            <li key={sort}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSorts.includes(sort)}
                  onChange={() => toggleSort(sort)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  {sort}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand</h2>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {brandDetails.map((brand) => (
            <li key={brand._id}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand._id)}
                  onChange={() => toggleBrand(brand._id)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  {brand.brand}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default Filters

