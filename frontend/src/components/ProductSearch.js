import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../assets/default.jpg';
import { useNavigate } from 'react-router-dom';
import { useVisibility } from './VisibilityProvider';
import './Styles.css';

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { componentOneVisible, hideComponentOneShowComponentTwo, showComponentOneHideComponentTwo } = useVisibility();
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

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

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/search/?q=${searchQuery}`);
      setSearchResults(response.data);
      setFilteredResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
    showComponentOneHideComponentTwo();
  };

  const handleDetailClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearButtonClick = () => {
    setSearchQuery('');
    setSearchResults([]);
    setFilteredResults([]);
    hideComponentOneShowComponentTwo();
  };

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    let sortedProducts = [...filteredResults];

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

    setFilteredResults(sortedProducts);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    const filtered = searchResults.filter(product => product.category.name === filterValue || filterValue === 'all');
    setFilteredResults(filtered);
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_product/${productId}/`);
      setFilteredResults(filteredResults.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddToCartClick = async (productId) => {
    const quantity = 1;
    try {
      const response = await axios.post('http://localhost:8000/api/add_to_cart/', {
        user_id: localStorage.getItem('user_id'),
        product_id: productId,
        quantity: quantity,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div>
      <div className='SearchFilterSort'>
        <div className='search-bar'>
          <input type="text" value={searchQuery} onChange={handleChange} placeholder="Search products..." />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleClearButtonClick}>X</button>
        </div>
        {componentOneVisible && 
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
          </div>}
      </div>
          
          <ul className="product-list">
            {filteredResults.map(product => (
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
                  <button className='buy-button' onClick={() => handleDetailClick(product.id)}>Detail</button>
                  {isAdmin ? (<><button className='buy-button' onClick={() => handleDeleteClick(product.id)}>Delete</button></>) : (<></>)}
                  {authenticated ? (<><button className="buy-button" onClick={() => handleAddToCartClick(product.id)}>Add to cart</button></>) : (<></>)}
                </div>
              </li>
            ))}
          </ul>
    </div>
  );
}

export default ProductSearch;
