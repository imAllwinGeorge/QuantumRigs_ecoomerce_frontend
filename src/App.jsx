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
import VerifyEmail from './components/user/login/ForgotPassword/VerifyEmail'
import NewPasword from './components/user/login/ForgotPassword/NewPasword'
import Profile from './components/user/Profile/Profile'
import UserProfileLayout from './components/layout/userLayout/UserProfileLayout'
import ChangePassword from './components/user/Profile/changePassword/ChangePassword'
import AddressMangement from './components/user/Profile/manageAddress/AddressMangement'
import EditAddress from './components/user/Profile/manageAddress/EditAddress'
import Cart from './components/user/cart/Cart'
import PlaceOrder from './components/user/checkout/PlaceOrder'
import Payment from './components/user/checkout/Payment'
import PriceLayout from './components/user/checkout/PriceLayout'
import MyOrders from './components/user/Profile/myOrders/MyOrders'
import Shop from './components/user/shop/Shop'
import AddCoupon from './components/admin/coupons/AddCoupon/AddCoupon'
import Wishlist from './components/user/wishlist/Wishlist'
import Wallet from './components/user/wallet/Wallet'

const App = () => {
  return (
    <div>
      <Breadcrumbs routes={routes} />
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/verify-otp' element={<VerifyOtp/>} />
        <Route path='/login' element={<UserHomeProtection><Login/></UserHomeProtection>} />
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/new-password' element={<NewPasword/>}/>


        <Route path='/home' element={<UserAuthLayer><UserLayout><Home /></UserLayout></UserAuthLayer>} />
        <Route path='/category' element={<UserAuthLayer><UserLayout><Category/></UserLayout></UserAuthLayer>} />
        <Route path='/about' element={<UserAuthLayer><UserLayout><About/></UserLayout></UserAuthLayer>} />
        <Route path='/contact' element={<UserAuthLayer><UserLayout><Contact/></UserLayout></UserAuthLayer>} />
        <Route path='/product_description' element={<UserAuthLayer><UserLayout><ProductDescription/></UserLayout></UserAuthLayer>} />
        <Route path='/shop' element={<UserAuthLayer><UserLayout><Shop/></UserLayout></UserAuthLayer>}/>
        <Route path='/user-profile' element={<UserAuthLayer><UserLayout><UserProfileLayout><Profile/></UserProfileLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/change-password' element={<UserAuthLayer><UserLayout><UserProfileLayout><ChangePassword/></UserProfileLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/address-management' element={<UserAuthLayer><UserLayout><UserProfileLayout><AddressMangement/></UserProfileLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/edit-address' element={<UserAuthLayer><UserLayout><UserProfileLayout><EditAddress/></UserProfileLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/cart' element={<UserAuthLayer><UserLayout><Cart/></UserLayout></UserAuthLayer>}/>
        <Route path='/place-order' element={<UserAuthLayer><UserLayout><PriceLayout><PlaceOrder/></PriceLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/payment' element={<UserAuthLayer><UserLayout><PriceLayout><Payment/></PriceLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/my-orders' element={<UserAuthLayer><UserLayout><UserProfileLayout><MyOrders/></UserProfileLayout></UserLayout></UserAuthLayer>}/>
        <Route path='/wishlist' element={<UserAuthLayer><UserLayout><Wishlist/></UserLayout></UserAuthLayer>} />
        <Route path='/wallet' element={<UserAuthLayer><UserLayout><UserProfileLayout><Wallet/></UserProfileLayout></UserLayout></UserAuthLayer>} />


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
        <Route path='/admin/add-coupon' element={<AuthLayer><AdminLayout><AddCoupon/></AdminLayout></AuthLayer>} />
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