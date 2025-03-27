import "./ProductListingSection.css";
import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { FixedSizeGrid } from 'react-window';

import { useData } from "../../../../contexts/DataProvider.js";

import { useUserData } from "../../../../contexts/UserDataProvider.js";

import { GridCell } from './components/GridCell';
import { useProductFiltering } from './hooks/useProductFiltering.js';
import { useGridDimensions } from './hooks/useGridDimensions.js';
import { GRID_CONSTANTS } from '../../constants';

export const ProductListingSection = () => {
  const { state, loading, hasMore, loadMoreProducts } = useData();
  const {
    isProductInCart,
    isProductInWishlist,
    wishlistHandler,
    addToCartHandler,
    cartLoading,
  } = useUserData();

  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadMoreProducts]);

  const sortedProducts = useProductFiltering(state);
  const { containerRef, numColumns } = useGridDimensions(GRID_CONSTANTS.COLUMN_WIDTH);
  
  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableTilt(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = useCallback((product) => {
    addToCartHandler(product);
  }, [addToCartHandler]);

  const handleWishlist = useCallback((product) => {
    wishlistHandler(product);
  }, [wishlistHandler]);

  if (!sortedProducts.length) {
    return <div className="no-products">No products found</div>;
  }

  const rowCount = Math.ceil(sortedProducts.length / numColumns);

  return (
    <div ref={containerRef} className="product-listing-section">
      <FixedSizeGrid
        className="products-grid"
        columnCount={numColumns}
        columnWidth={GRID_CONSTANTS.COLUMN_WIDTH}
        height={window.innerHeight - GRID_CONSTANTS.HEIGHT_OFFSET}
        rowCount={rowCount}
        rowHeight={GRID_CONSTANTS.ROW_HEIGHT}
        width={containerRef.current?.offsetWidth || window.innerWidth - GRID_CONSTANTS.WIDTH_OFFSET}
      >
        {(props) => (
          <GridCell
            {...props}
            numColumns={numColumns}
            sortedProducts={sortedProducts}
            enableTilt={enableTilt}
            cartLoading={cartLoading}
            isProductInCart={isProductInCart}
            isProductInWishlist={isProductInWishlist}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlist}
          />
        )}
      </FixedSizeGrid>
    </div>
  );
};
