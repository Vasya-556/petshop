import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../assets/default.jpg';
import { useNavigate } from 'react-router-dom';

function UserPage() {
  const userId = localStorage.getItem('user_id');
  const [UserData, setUserData] = useState(null);
  const [CartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching User:', error);
      }
    };

    const fetchUserCart = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get_cart_items/${userId}/`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching Cart Items:', error);
      }
    };

    fetchUser();
    fetchUserCart();
  }, [userId]);

  const handleDetailClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!UserData) {
    return (
      <div className='auth-error'>
        <h3>Sorry, it seems like you are not authenticated</h3>
        <div className='auth-links'>
          <a href="/">Go home</a>
          <a href="/signin">Try again</a>
        </div>
      </div>
    );
  }

  const renderProduct = (product, quantity) => {
    return (
      <div key={product.id}>
        <div className='product-card-content'>
          <h2>{product.p_name}</h2>
          <p>{product.description}</p>
          <p>Ціна: ${product.price}</p>
          <p>Кількість: {quantity}</p>
          <div className="image-container">
            {product.product_image ? (
              <img
                src={`http://localhost:8000${product.product_image}`}
                alt={product.p_name}
              />
            ) : (
              <img
                src={defaultImage}
                alt=""
              />
            )}
          </div>
          <button className='buy-button' onClick={() => handleDetailClick(product.id)}>Detail</button>
        </div>
      </div>
    );
  };

  return (
    <div className='user-page'>
      <div className='user-profile'>
        <p><strong>Username:</strong> {UserData.username}</p>
        <p><strong>Email:</strong> {UserData.email}</p>
        <div className="image-container">
          {UserData.profile_image ? (
            <img
              src={`http://localhost:8000${UserData.profile_image}`}
              alt="Profile"
              className='profile-image'
            />
          ) : (
            <img
              src={defaultImage}
              alt="Default Profile"
              className='profile-image'
            />
          )}
        </div>
      </div>
      <div className='cart-items'>
        <ul className='product-list'>
          {CartItems.map(item => (
            <li key={item.id} className='product-card'>
              {renderProduct(item.product, item.quantity)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserPage;
