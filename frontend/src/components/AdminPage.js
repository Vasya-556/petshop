import React, { useState, useEffect} from 'react'
import axios from 'axios';
import defaultImage from '../assets/default.jpg';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [CartsItems, SetCartsItems] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

    useEffect (() => {
        const fetchAllCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get_all_users_cart_items/');
                SetCartsItems(response.data);
              } catch (error) {
                console.error('Error fetching carts items:', error);
            }
        };

        fetchAllCartItems();
    }, []);

    const renderProduct = (product, quantity, item) => {
        return(
          <div key={product.id} className='product-card-content'>
            <p>product id {product.id}</p>
            <p>product name {product.p_name}</p>
            <p>product description {product.description}</p>
            <p>product price {product.price}</p>
            <p>product stock {product.stock}</p>
            <p>product quantity {quantity}</p>
            <p>product price {product.id}</p>
            <div className="image-container">
                {product.product_image ? (
                    <img
                        src={`http://localhost:8000${product.product_image}`}
                        alt={product.p_name}
                        style={{width:'200px', height:"200px"}}
                    />
                    ) : (
                    <img
                        src={defaultImage}
                        alt=""
                        style={{width:'200px', height:"200px"}}
                    />
                )}
            </div>
            <button className='buy-button'  onClick={() => handleDetailClick(product.id)}>Detail</button> 
            <button className='buy-button'  onClick={() => handleSendProductClick(item)}>Send product</button>   
          </div>
        );
      };

      const handleDetailClick = async (productId) => {
        navigate(`/product/${productId}`);
      };
      
      const handleSendProductClick = async (item) => {
        try {
            const response = await axios.post('http://localhost:8000/api/purchase_product/', {
              product_id: item.product.id,
              quantity: item.quantity,
            });
      
            setMessage(`Purchase successful.`);
            const updatedCartsItems = CartsItems.map(cartItem => {
              if (cartItem.product.id === item.product.id) {
                return {
                  ...cartItem,
                  product: {
                    ...cartItem.product,
                    stock: response.data.remaining_stock
                  }
                };
              }
              return cartItem;
            });
            SetCartsItems(updatedCartsItems);
          } catch (error) {
            setMessage('Error purchasing product: ' + (error.response ? error.response.data.error : error.message));
          }
        };

  return (
    <div>
        <div className='message'>{message}</div>
        <ul className='product-list'>
        {CartsItems.map(item => (
            <div key={item.id}>
            {/* <p>cart item id {item.id}</p> */}
            {/* {renderProduct(item.product, item.quantity, item)} */}
            {/* <p>quantity {item.quantity}</p> */}

            {/* <button onClick={() => handleSendProductClick(item)}>Send product</button> */}
              <li key={item.id} className='product-card'>
                {renderProduct(item.product, item.quantity, item)}
              </li>
            </div>
        ))}
        </ul>
    </div>
  )
}

export default AdminPage