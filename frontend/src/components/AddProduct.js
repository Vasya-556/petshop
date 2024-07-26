import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageNotFound from './PageNotFound';

function AddProduct() {
  const [formData, setFormData] = useState({
    p_name: '',
    description: '',
    product_image: null,
    price: '',
    stock: '',
    category_id: ''
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
      }
    };

    fetchCategories();

    const checkAuth = () => {
      const token = localStorage.getItem('access_token'); 
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('p_name', formData.p_name);
    data.append('description', formData.description);
    if (formData.product_image) {
      data.append('product_image', formData.product_image);
    }
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category_id', formData.category_id);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add_product/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Product added successfully!');
      setFormData({
        p_name: '',
        description: '',
        product_image: null,
        price: '',
        stock: '',
        category_id: ''
      });
    } catch (error) {
      console.error('There was an error adding the product!', error);
      setMessage('Failed to add product.');
    }
  };

  if (!isLoggedIn) {
    return <div>
      <PageNotFound/>
    </div>; 
  }

  return (
    <div className='add-product-container'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="p_name"
            value={formData.p_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Product Image:</label>
          <input
            type="file"
            name="product_image"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddProduct;