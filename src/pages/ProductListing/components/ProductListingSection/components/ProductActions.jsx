import React from 'react';
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";

export const ProductActions = ({ 
  product, 
  cartLoading, 
  isProductInCart, 
  isProductInWishlist, 
  onAddToCart, 
  onWishlistToggle 
}) => (
  <div className="product-card-buttons">
    <button
      disabled={cartLoading}
      onClick={() => onAddToCart(product)}
      className={`cart-btn ${isProductInCart(product) ? "in-cart" : ""}`}
    >
      {!isProductInCart(product) ? "Add To Cart" : "Go to Cart"}
    </button>
    <button
      onClick={() => onWishlistToggle(product)}
      className="wishlist-btn"
    >
      {!isProductInWishlist(product) ? (
        <AiOutlineHeart size={30} />
      ) : (
        <AiTwotoneHeart color="red" size={30} />
      )}
    </button>
  </div>
); 