import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from '../assets/default.jpg'

function ProductPage(){
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(null);
    const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product/${productId}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get_rating/${productId}/`);
        const roundedRating = parseFloat(response.data.average_rating).toFixed(1);
        setRating(roundedRating);
      } catch (error) {
        console.error('Error fetching product rating:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get_comments/${productId}/`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching product rating:', error);
      }
    }

    fetchProduct();
    fetchRating();
    fetchComments();
  }, [productId]);

  if (!product) {
    return <div>
        <h3>Product not found</h3>
        <a href="/">Go home</a>
    </div>;
  }

  const renderComments = (commentsArray, commentId) => {
    const comment = commentsArray[commentId];

    if (!comment) return null;

    return (
      <div key={comment.id} className="comment-container">
        <hr />
        {comment.parent_comment !== null && comment.parent_comment !== undefined && (
          <div className="parent-comment">
            <p>Parent Comment:</p>
            {renderComments(commentsArray, comment.parent_comment)}
          </div>
        )}
        <p className="comment-author">Author: {comment.author}</p>
        <p className="comment-time">Time Created: {comment.time_create}</p>
        <p className="comment-text">{comment.text}</p>
        <hr />
      </div>
    );
  };

  const parseComments = (comments) => {
    const commentsArray = {};

    comments.forEach(comment => {
      if (comment.id) {
        commentsArray[comment.id] = comment;
      }
    });

    const sortedComments = Object.values(commentsArray).sort((a, b) => {
      return new Date(b.time_create) - new Date(a.time_create);
    });
  
    return sortedComments.map(comment => renderComments(commentsArray, comment.id));
  };

  return (
    <div>
      <div className="single-product-container">
      <h2>{product.p_name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Rating: {rating}</p>
      {product.product_image ? (
              <img
                src={`http://localhost:8000${product.product_image}`}
                alt={product.p_name}
                className="product-image"
              />
            ) : (
              <img
                src={defaultImage}
                alt="Default Image"
                className="product-image"
              />
            )}
      </div>
      {/* <p>Category: {product.category}</p> */}
      
      <div>
        {parseComments(comments)}
      </div>
    </div>
  )
}

export default ProductPage