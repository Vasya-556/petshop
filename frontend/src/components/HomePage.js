import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../assets/default.jpg'
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        axios.post('http://localhost:8000/api/token/verify/', { token: accessToken })
          .then(() => {
            setAuthenticated(true);
          })
          .catch(() => {
            setAuthenticated(false);
          });
      } else {
        setAuthenticated(false);
      }
    }, []);

    const handleBuyClick = async (productId) => {
        try {
          await axios.delete(`http://localhost:8000/api/product/${productId}/`);
          setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };

  return (
    <div>
      <ul className="product-list">
    {products.map(product => (
      <li key={product.id} className="product-card">
        <div className="product-card-content">
          <h2>{product.p_name}</h2>
          <p>{product.description}</p>
          <p>Ціна: ${product.price}</p>
          <p>Кількість: {product.stock}</p>
          <div className="image-container">
            {product.product_image ? (
              <img
                src={`http://localhost:8000${product.product_image}`}
                alt={product.p_name}
              />
            ) : (
              <img
                src={defaultImage}
                alt="Default Image"
              />
            )}
          </div>
            {authenticated ? (<><button className="buy-button" onClick={() => handleBuyClick(product.id)}>Buy</button></>) : (<></>)}
        </div>
      </li>
    ))}
  </ul>
    </div>
  );
}

export default HomePage;