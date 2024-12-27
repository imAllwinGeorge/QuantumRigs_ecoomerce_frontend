import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/Axios';
import './Home.css'
// const imgURL = process.env.IMG_URL

const Home = () => {
  const [productDetails, setProductDetails] = useState([]);
  const navigate = useNavigate();

  // const featuredProducts = [
  //   { id: 1, name: "Gaming PC Case", price: 199.99, rating: 5, image: "/placeholder.svg?height=200&width=200" },
  //   { id: 2, name: "RGB Tower Case", price: 149.99, rating: 4, image: "/placeholder.svg?height=200&width=200" },
  //   { id: 3, name: "Compact Case", price: 99.99, rating: 4, image: "/placeholder.svg?height=200&width=200" },
  //   { id: 4, name: "Premium Case", price: 299.99, rating: 5, image: "/placeholder.svg?height=200&width=200" },
  // ];

  useEffect(() => {
    try {
      const fetchProductDetails = async () => {
        const response = await axiosInstance.get('/home');
        if (response.status === 200) {
          console.log(response.data);
          setProductDetails(response.data);
        }
      };
      fetchProductDetails();
    } catch (error) {
      console.log('fetchProductDetails', error);
    }
  }, []);

  return (
    <div id="home-page"  >

       {/* Hero Section */}
       <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>CYBER MONDAY</h2>
            <p>Incredible deals on gaming PCs and components</p>
            <button className="shop-button">Shop Now</button>
          </div>
          <div className="hero-image">
            <img src="/banners/01733141860CYBER MONDAY LIAN LI SALE BANNER-desktop.jpg" alt="Gaming PC" />
          </div>
        </div>
      </section>

      {/* Featured Products
      <section className="products-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img className="product-image" src={product.image} alt={product.name} />
              <h3 className="product-name">{product.name}</h3>
              <div className="product-details">
                <span className="price">${product.price}</span>
                <span className="rating">
                  {'★'.repeat(product.rating)}
                  {'☆'.repeat(5 - product.rating)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Fetched Products */}
      <h2 className='section-title' >New Arrivals</h2>
      <section className="fetched-products-section">
        
        {productDetails &&
          productDetails.map((product, index) => (
            <div key={product._id} className="fetched-product-card" onClick={()=>navigate('/product_description',{state:{productId:product._id}})} >
              <div className="fetched-product-image-wrapper">
                <img
                  className="fetched-product-image"
                  src={`http://localhost:3000/uploads/images/${product.images[0]}`}
                  alt={product.productName}
                />
              </div>
              <h3 className="fetched-product-name">{product.productName}</h3>
              <p className="fetched-product-regular-price">₹{product?.variants[0].regularPrice}</p>
              <h5 className="fetched-product-sale-price">₹{product?.variants[0].salePrice}</h5>
              <span className="rating">
                {'★'.repeat(4)}
                {'☆'.repeat(1)}
              </span>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Home;
