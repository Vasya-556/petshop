import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../assets/default.jpg'
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useVisibility } from './VisibilityProvider';
import ProductSearch from './ProductSearch';

function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { componentTwoVisiblePart } = useVisibility();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        setProducts(response.data);
        setFilteredProducts(response.data);
        const response2 = await axios.get('http://localhost:8000/api/categories/');
        setCategories(response2.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();

    const fetchUserData = async () => {
      try {
        if (!userId) {
          setIsAdmin(false);
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/`);
        setIsAdmin(response.data.status === 'admin');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAdmin(false);
      }
    };
  
    if (userId) {
      fetchUserData();
    } else {
      setIsAdmin(false);
    }
  }, []);

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

    const handleDeleteClick = async (productId) => {
        try {
          await axios.delete(`http://localhost:8000/api/delete_product/${productId}/`);
          setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };

    const handleDetailClick = (productId) => {
      navigate(`/product/${productId}`);
    };

    const handleAddToCartClick = async (productId) => {  
      const quantity = 1;
      try {
        const response = await axios.post('http://localhost:8000/api/add_to_cart/', {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        });
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    };

    const handleSortChange = (event) => {
      const sortValue = event.target.value;
      let sortedProducts = [...filteredProducts];
  
      if (sortValue === 'priceAsc') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortValue === 'priceDesc') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortValue === 'nameAsc') {
        sortedProducts.sort((a, b) => a.p_name.localeCompare(b.p_name));
      } else if (sortValue === 'nameDesc') {
        sortedProducts.sort((a, b) => b.p_name.localeCompare(a.p_name));
      } else if (sortValue === 'stockAsc') {
        sortedProducts.sort((a, b) => parseFloat(a.stock) - parseFloat(b.stock));
      } else if (sortValue === 'stockDesc') {
        sortedProducts.sort((a, b) => parseFloat(b.stock) - parseFloat(a.stock));
      }
  
      setFilteredProducts(sortedProducts);
    };
  
    const handleFilterChange = (event) => {
      const filterValue = event.target.value;
      const filtered = products.filter(product => product.category.name === filterValue || filterValue === 'all');
      setFilteredProducts(filtered);
    };
  
  return (
    <div className='HomePage'>
      <ProductSearch/>
      {componentTwoVisiblePart && 
      <div>
        <div className='filter-sort-conteiner'>
          <div className='filter-sort'>
            <select onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
              <option value="stockAsc">Stock: Low to High</option>
              <option value="stockDesc">Stock: High to Low</option>
            </select>

            <select onChange={handleFilterChange}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>  
        </div>
        
        <ul className="product-list">
          {filteredProducts.map(product => (
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
                      alt=""
                    />
                  )}
                </div>
                  {/* {authenticated ? (<><button className="buy-button" onClick={() => handleBuyClick(product.id)}>Buy</button></>) : (<></>)} */}
                  {isAdmin ? (<><button className='buy-button' onClick={() => handleDeleteClick(product.id)}>Delete</button></>) : (<></>)}
                  {authenticated ? (<><button className="buy-button" onClick={() => handleAddToCartClick(product.id)}>Add to cart</button></>) : (<></>)}
              <button className='buy-button' onClick={() => handleDetailClick(product.id)}>Detail</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      }
    </div>
  );
}

export default HomePage;