import React from 'react';
import { BsFillStarFill } from "react-icons/bs";

export const ProductDetails = ({ product }) => (
  <div className="product-card-details">
    <h3>{product.name}</h3>
    <p className="ratings">
      {product.rating}
      <BsFillStarFill color="orange" /> ({product.reviews} reviews){" "}
    </p>
    <div className="price-container">
      <p className="original-price">${product.original_price}</p>
      <p className="discount-price">${product.discounted_price}</p>
    </div>
    <p>Genre: {product.category_name}</p>
    <div className="info">
      {!product.is_stock && <p className="out-of-stock">Out of stock</p>}
      {product.trending && <p className="trending">Trending</p>}
    </div>
  </div>
); 