import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/user/LandingPage/LandingPage'
import Home from './components/user/Home/Home'
import Category from './components/user/Category/Category'
import About from './components/user/About/About'
import Contact from './components/user/Contact/Contact'
import SignUp from './components/user/signup/SignUp'
import Login from './components/user/login/Login'
import AdminLogin from './components/admin/login/AdminLogin'
import AdminLayout from './components/layout/adminLayout/AdminLayout'
import AdminDashboard from './components/admin/dashboard/AdminDashboard'
import Products from './components/admin/products/Products'
import Users from './components/admin/users/Users'
import Categories from './components/admin/categories/Categories'
import Coupons from './components/admin/coupons/Coupons'
import Banners from './components/admin/banners/Banners'
import Offers from './components/admin/offers/Offers'
import Brands from './components/admin/brands/Brands'
import Orders from './components/admin/orders/Orders'
import AddCategory from './components/admin/categories/AddCategory'
import EditSubCategory from './components/admin/categories/EditSubCategory'
import EditingCategory from './components/admin/categories/EditingCategory'
import AddProducts from './components/admin/products/AddProducts'
import AddBrands from './components/admin/brands/AddBrand'
import MoreProductDetails from './components/admin/products/MoreProductDetails'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/category' element={<Category/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/adminlogin' element={<AdminLogin/>} />
        
        <Route path='/adminhome' element={<AdminLayout><AdminDashboard/></AdminLayout>} />
        <Route path='/admin/orders' element={<AdminLayout><Orders/></AdminLayout>} />
        <Route path='/admin/products' element={<AdminLayout><Products/></AdminLayout>} />
        <Route path='/admin/addproducts' element={<AdminLayout><AddProducts/></AdminLayout>} />
        <Route path='/admin/users' element={<AdminLayout><Users/></AdminLayout>} />
        <Route path='/admin/categories' element={<AdminLayout><Categories/></AdminLayout>} />
        <Route path='/editcategory' element={<EditingCategory/>}/>
        <Route path='/admin/addcategory' element={<AddCategory/>} />
        <Route path='/editsubcategory' element={<EditSubCategory/>} />
        <Route path='/admin/coupon' element={<AdminLayout><Coupons/></AdminLayout>} />
        <Route path='/admin/banners' element={<AdminLayout><Banners/></AdminLayout>} />
        <Route path='/admin/offers' element={<AdminLayout><Offers/></AdminLayout>} />
        <Route path='/admin/brands' element={<AdminLayout><Brands/></AdminLayout>} />
        <Route path='/admin/addbrands' element={<AddBrands/>} />
        
       
      </Routes>
    </div>
  )
}

export default App