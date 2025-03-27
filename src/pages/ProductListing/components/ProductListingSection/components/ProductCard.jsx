import React from 'react';
import { Link } from "react-router-dom";
import Tilt from 'react-parallax-tilt';
import { ProductImage } from './ProductImage';
import { ProductDetails } from './ProductDetails';
import { ProductActions } from './ProductActions';

export const ProductCard = ({ 
  product, 
  isFirstProduct,
  enableTilt,
  cartLoading,
  isProductInCart,
  isProductInWishlist,
  onAddToCart,
  onWishlistToggle 
}) => {
  const CardContent = () => (
    <div className="product-card">
      <Link to={`/product-details/${product.id}`}>
        <ProductImage product={product} isFirstProduct={isFirstProduct} />
      </Link>
      <ProductDetails product={product} />
      <ProductActions 
        product={product}
        cartLoading={cartLoading}
        isProductInCart={isProductInCart}
        isProductInWishlist={isProductInWishlist}
        onAddToCart={onAddToCart}
        onWishlistToggle={onWishlistToggle}
      />
    </div>
  );

  return isFirstProduct ? (
    <CardContent />
  ) : (
    <Tilt
      tiltMaxAngleX={7}
      tiltMaxAngleY={7}
      perspective={800}
      transitionSpeed={1500}
      scale={1.02}
      gyroscope={true}
      enabled={enableTilt}
    >
      <CardContent />
    </Tilt>
  );
}; 