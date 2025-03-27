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

  const handleScroll = useCallback(({ scrollTop, scrollHeight, clientHeight }) => {
    // Only trigger when we're near the bottom (last 20% of scroll)
    const scrollThreshold = scrollHeight * 0.8;
    const currentPosition = scrollTop + clientHeight;

    if (!loading && hasMore && currentPosition >= scrollThreshold) {
      loadMoreProducts();
    }
  }, [loading, hasMore, loadMoreProducts]);

  // Reset grid scroll position when products change
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
        onScroll={handleScroll}
        overscanRowCount={2}
        useIsScrolling
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
