"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { toast } from "react-toastify"
import axiosInstance from "../../../api/Axios"
import { useLocation, useNavigate } from "react-router-dom"
import Filters from "./Filters"
import {Search} from "lucide-react"
import Pagination from "../../admin/products/utility/Pagination"

const Shop = () => {
  const [productDetails, setProductDetails] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [brandDetails, setBrandDetails] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTerm1, setSearchTerm1] = useState(()=>localStorage.getItem("searchTerm")||"")
   const [currentPage, setCurrentPage] = useState(
      () => parseInt(localStorage.getItem("currentShopPage")) || 1
    );
    const [postsPerPage, setPostsPerPage] = useState(8);
  const navigate = useNavigate()
  const searchInputRef = useRef();
  const location = useLocation();
  const imageUrl = import.meta.env.VITE_IMG_URL

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get("/home")
        if (response.status === 200) {
          console.log(response.data)
          // setProductDetails(response?.data?.productDetails)
          // setFilteredProducts(response?.data?.productDetails)
          setBrandDetails(response?.data?.brandDetails)
        }
      } catch (error) {
        console.log("fetch product details shop page", error.message)
        toast(error.response.data)
      }
    }
    fetchProductDetails()
    
  }, [])


  useEffect(()=>{
    console.log("ref.current consoled for clarity",searchInputRef.current);
    searchInputRef.current?.focus();
  },[])

  const onFilterChange = useCallback(
    ({ priceRange, filters, sorts, brands }) => {
      let newFilteredProducts = [...productDetails]

      // Apply search filter
      if (searchTerm) {
        newFilteredProducts = newFilteredProducts.filter((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply price filter
      newFilteredProducts = newFilteredProducts.filter((product) => {
        const salePrice = product.variants?.[0]?.salePrice
        return salePrice !== undefined && salePrice >= priceRange.min && salePrice <= priceRange.max
      })

      // Apply brand filter
      if (brands.length > 0) {
        newFilteredProducts = newFilteredProducts.filter(
          (product) => product.brandId && brands.includes(product.brandId),
        )
      }

      // Apply other filters
      if (filters.includes("New arrivals")) {
        newFilteredProducts = newFilteredProducts.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        )
      }
      // Add more filter logic here for other filter types

      // Apply sorting
      if (sorts.length > 0) {
        const sortMethod = sorts[0]
        switch (sortMethod) {
          case "aA - zZ":
            newFilteredProducts.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""))
            break
          case "zZ - aA":
            newFilteredProducts.sort((a, b) => (b.productName || "").localeCompare(a.productName || ""))
            break
          case "Price: Low to High":
            newFilteredProducts.sort((a, b) => (a.variants?.[0]?.salePrice || 0) - (b.variants?.[0]?.salePrice || 0))
            break
          case "Price: High to Low":
            newFilteredProducts.sort((a, b) => (b.variants?.[0]?.salePrice || 0) - (a.variants?.[0]?.salePrice || 0))
            break
          default:
            break
        }
      }

      setFilteredProducts(newFilteredProducts)
      // console.log(priceRange)

      // setPriceRange(priceRange)
      // setFilters(filters)
      // setSorts(sorts)
      // setBrands(brands)
      // handleServerSearch();
    },
    [productDetails,searchTerm],
  )

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value)
  // }
  const handleSearch1 = (event) => {
    setSearchTerm1(event.target.value)
    if (throttleTimeout.current) {
      clearTimeout(throttleTimeout.current);
    }

    throttleTimeout.current = setTimeout(() => {
      handleServerSearch();
    }, 5000);
  }

  const handleServerSearch = async()=>{
    try {
      localStorage.setItem("searchTerm",searchTerm1)
      const response = await axiosInstance.post("/product/search",{searchTerm1});
      console.log("handle server side search",response);
      if(response.status === 200){
        setFilteredProducts(response?.data?.filteredProducts)
        setProductDetails(response?.data?.filteredProducts)
      }
    } catch (error) {
      console.log("handle server side search",error)
      toast(error?.response?.data?.message)
    }
  }
  useEffect(()=>{
    console.log("function executed")
    handleServerSearch();
  },[searchTerm1])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('searchTerm');
      localStorage.removeItem('currentShopPage')
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    onFilterChange({ priceRange: { min: 20, max: 300000 }, filters: [], sorts: [], brands: [] })
  }, [onFilterChange]) // Removed searchTerm from dependencies
   useEffect(() => {
      localStorage.setItem("currentShopPage", currentPage);
     
    }, [currentPage]);
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = filteredProducts.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="container mx-auto px-4 py-5">
      
      <div className="mb-8 py-5 relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search products..."
          value={searchTerm1}
          onChange={handleSearch1}
          className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleServerSearch} ><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" /></button>
      </div>
     
        <div className="flex flex-col md:flex-row">
        <Filters brandDetails={brandDetails} onFilterChange={onFilterChange} />
        <div className="flex-1 md:ml-8">
          <h2 className="text-3xl pt-10 text-black md:text-4xl font-extrabold text-center mb-12">Shop</h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPosts.map((product) =>(
              <div
                key={product._id}
                onClick={() =>
                  navigate("/product_description", {
                    state: { productId: product._id },
                  })
                }
                className="bg-slate-300 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 m-0"
                    src={`${imageUrl}${product.images?.[0] || "default-image.jpg"}`}
                    alt={product.productName || "Product image"}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.productName || "Unnamed Product"}
                  </h3>
                  {product.variants?.[0]?.regularPrice && (
                    <p className="text-gray-500 line-through">₹{product.variants[0].regularPrice}</p>
                  )}
                  {product.variants?.[0]?.salePrice && (
                    <h5 className="text-xl font-bold text-gray-900">₹{product.variants[0].salePrice.toFixed(2)}</h5>
                    
                  )}
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">
                      {"★".repeat(4)}
                      <span className="text-gray-300">{"☆".repeat(1)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <div className="mt-8 w-full">
        <Pagination
          totalPosts={filteredProducts.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  )
}

export default Shop

