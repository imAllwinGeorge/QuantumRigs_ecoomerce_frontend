import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Grid,
  LayoutGrid,
  Monitor,
  Package,
  Percent,
  ShoppingCart,
  Ticket,
  Users,
} from "lucide-react";

const AdminSide = () => {
  return (
    <nav className="bg-[#111] w-64 min-h-screen py-6 border-r border-gray-800  ">
      <ul className="space-y-1">
        <li>
          <Link
            to="/adminhome"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <LayoutGrid className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <ShoppingCart className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Package className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Users className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/categories"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Grid className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Categories</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/coupon"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Ticket className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Coupons</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/banners"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Monitor className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Banners</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/offers"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group border-b border-gray-800"
          >
            <Percent className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Offers</span>
          </Link>
        </li>
        {/* <li>
          <Link
            to="/admin/brands"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
          >
            <Award className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
            <span>Brands</span>
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default AdminSide;
