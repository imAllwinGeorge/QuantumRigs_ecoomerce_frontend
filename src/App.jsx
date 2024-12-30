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
import EditProduct from './components/admin/products/edit product/EditProduct'
import ProtectionLayout from './components/layout/protection/ProtectionLayout'
import AuthLayer from './components/layout/protection/AuthLayer'
import VerifyOtp from './components/user/signup/VerifyOtp'
import UserLayout from './components/layout/userLayout/UserLayout'
import UserAuthLayer from './components/layout/protection/UserAuthLayer'
import ProductDescription from './components/user/product/ProductDescription'
import UserHomeProtection from './components/layout/protection/UserHomeProtection'
import routes from '../src/config/breadCrumsConfig'
import { ToastContainer, toast } from 'react-toastify';
import Breadcrumbs from './components/admin/products/utility/breadcrumbs'

const App = () => {
  return (
    <div>
      <Breadcrumbs routes={routes} />
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/verify-otp' element={<VerifyOtp/>} />
        <Route path='/login' element={<UserHomeProtection><Login/></UserHomeProtection>} />


        <Route path='/home' element={<UserAuthLayer><UserLayout><Home /></UserLayout></UserAuthLayer>} />
        <Route path='/category' element={<UserAuthLayer><UserLayout><Category/></UserLayout></UserAuthLayer>} />
        <Route path='/about' element={<UserAuthLayer><UserLayout><About/></UserLayout></UserAuthLayer>} />
        <Route path='/contact' element={<UserAuthLayer><UserLayout><Contact/></UserLayout></UserAuthLayer>} />
        <Route path='/product_description' element={<UserAuthLayer><UserLayout><ProductDescription/></UserLayout></UserAuthLayer>} />
        


        <Route path='/adminlogin' element={<ProtectionLayout><AdminLogin/></ProtectionLayout>} />
        
        <Route path='/adminhome' element={<AuthLayer><AdminLayout><AdminDashboard/></AdminLayout></AuthLayer>} />
        <Route path='/admin/orders' element={<AuthLayer><AdminLayout><Orders/></AdminLayout></AuthLayer>} />
        <Route path='/admin/products' element={<AuthLayer><AdminLayout><Products/></AdminLayout></AuthLayer>} />
        <Route path='/admin/addproducts' element={<AuthLayer><AdminLayout><AddProducts/></AdminLayout></AuthLayer>} />
        <Route path='/admin/editproduct' element={<AuthLayer><AdminLayout><EditProduct/></AdminLayout></AuthLayer>} />
        <Route path='/admin/users' element={<AuthLayer><AdminLayout><Users/></AdminLayout></AuthLayer>} />
        <Route path='/admin/categories' element={<AuthLayer><AdminLayout><Categories/></AdminLayout></AuthLayer>} />
        <Route path='/editcategory' element={<AuthLayer><AdminLayout><EditingCategory/></AdminLayout></AuthLayer>}/>
        <Route path='/admin/addcategory' element={<AuthLayer><AdminLayout><AddCategory/></AdminLayout></AuthLayer>} />
        <Route path='/editsubcategory' element={<AuthLayer><AdminLayout><EditSubCategory/></AdminLayout></AuthLayer>} />
        <Route path='/admin/coupon' element={<AuthLayer><AdminLayout><Coupons/></AdminLayout></AuthLayer>} />
        <Route path='/admin/banners' element={<AuthLayer><AdminLayout><Banners/></AdminLayout></AuthLayer>} />
        <Route path='/admin/offers' element={<AuthLayer><AdminLayout><Offers/></AdminLayout></AuthLayer>} />
        <Route path='/admin/brands' element={<AuthLayer><AdminLayout><Brands/></AdminLayout></AuthLayer>} />
        <Route path='/admin/addbrands' element={<AuthLayer><AdminLayout><AddBrands/></AdminLayout></AuthLayer>} />
        
       
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App