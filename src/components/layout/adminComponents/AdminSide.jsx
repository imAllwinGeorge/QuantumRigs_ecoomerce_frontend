import React from 'react'
import { Link } from 'react-router-dom'
import './AdminSide.css'

const AdminSide = () => {
  return (
    <nav className="admin-sidebar">
      <ul className="admin-sidebar-menu">
        <li className="admin-sidebar-item">
          <Link to='/adminhome' className="admin-sidebar-link">Dashboard</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/orders' className="admin-sidebar-link">Orders</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/products' className="admin-sidebar-link">Products</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/users' className="admin-sidebar-link">Users</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/categories' className="admin-sidebar-link">Categories</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/coupon' className="admin-sidebar-link">Coupons</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/banners' className="admin-sidebar-link">Banners</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/offers' className="admin-sidebar-link">Offers</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to='/admin/brands' className="admin-sidebar-link">Brands</Link>
        </li>
      </ul>
    </nav>
  )
}

export default AdminSide

