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

  const sortedProducts = useProductFiltering(state);
  const { containerRef, numColumns, containerHeight } = useGridDimensions(GRID_CONSTANTS.COLUMN_WIDTH);
  
  const [enableTilt, setEnableTilt] = useState(false);
  const gridRef = useRef();

  const sentinelRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableTilt(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const sentinel = entries[0];
        if (sentinel.isIntersecting && !loading && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore, loadMoreProducts]);

  const handleAddToCart = useCallback((product) => {
    addToCartHandler(product);
  }, [addToCartHandler]);

  const handleWishlist = useCallback((product) => {
    wishlistHandler(product);
  }, [wishlistHandler]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo(0);
    }
  }, [sortedProducts.length]);

  if (!sortedProducts.length) {
    return <div className="no-products">No products found</div>;
  }

  const rowCount = Math.ceil(sortedProducts.length / numColumns);

  return (
    <div ref={containerRef} className="product-listing-section">
      <FixedSizeGrid
        ref={gridRef}
        className="products-grid"
        columnCount={numColumns}
        columnWidth={GRID_CONSTANTS.COLUMN_WIDTH}
        height={containerHeight || window.innerHeight - GRID_CONSTANTS.HEIGHT_OFFSET}
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
      
      {/* Add loading sentinel */}
      {hasMore && (
        <div 
          ref={sentinelRef} 
          style={{ height: '20px', margin: '20px 0' }}
        >
          {loading && 'Loading more products...'}
        </div>
      )}
    </div>
  );
};
