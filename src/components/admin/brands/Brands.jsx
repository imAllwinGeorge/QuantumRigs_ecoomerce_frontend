import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/Axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);


  const toggleBrandList = async(brandId,isListed)=>{
    try {
      console.log("brandId for toggle",brandId)
      const response = await axiosInstance.patch(`/admin/brand/toggle-list/${brandId}`);
      console.log(response);
      if(response.status === 200){
        setBrands((prevBrands)=>
          prevBrands.map((brand)=>
            brand._id === brandId?{...brand,isListed:!isListed}:brand
          )
        )
        toast(response?.data?.message)
      }
    } catch (error) {
      console.log("toggle brand list",error)
      toast(error?.response?.data?.message || "something went wrong, please try again")
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("/admin/brands");
        console.log(response.data);
        if (response.status === 200) {
          setBrands(response.data);
        }
      } catch (error) {
        console.log("fetchUser brands", console.log(error));
      }
    };
    fetchBrands();
  }, []);
  return (
    <div>
      <button onClick={() => navigate("/admin/addbrands")}>Add Brand</button>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand</th>
              <th>Description</th>

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand._id}>
                <td>{index + 1}</td>
                <td>{brand.brand}</td>
                <td>{brand.description}</td>

                <td>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      brand.isListed 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "Do you want to change the status?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, change it!",
                        cancelButtonText: "Cancel",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          toggleBrandList(brand._id,brand.isListed);
                        }
                      });
                    }}
                  >
                    {brand.isListed ? "UnList" : "List"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brands;
