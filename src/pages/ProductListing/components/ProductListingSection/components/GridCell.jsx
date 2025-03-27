import React from 'react';
import { ProductCard } from './ProductCard';

export const GridCell = ({ 
  columnIndex, 
  rowIndex, 
  style,
  numColumns,
  sortedProducts,
  enableTilt,
  cartLoading,
  isProductInCart,
  isProductInWishlist,
  onAddToCart,
  onWishlistToggle
}) => {
  const index = rowIndex * numColumns + columnIndex;
  const product = sortedProducts[index];

  if (!product) return null;

  return (
    <div style={style}>
      <ProductCard 
        product={product}
        isFirstProduct={index === 0}
        enableTilt={enableTilt}
        cartLoading={cartLoading}
        isProductInCart={isProductInCart}
        isProductInWishlist={isProductInWishlist}
        onAddToCart={onAddToCart}
        onWishlistToggle={onWishlistToggle}
      />
    </div>
  );
}; 