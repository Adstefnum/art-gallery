import "./ProductListingSection.css";
import Tilt from "react-parallax-tilt";
import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { FixedSizeGrid } from 'react-window';

import { useData } from "../../../../contexts/DataProvider.js";
import { Link } from "react-router-dom";
import { getCategoryWiseProducts } from "../../../../helpers/filter-functions/category";
import { getRatedProducts } from "../../../../helpers/filter-functions/ratings";
import { getPricedProducts } from "../../../../helpers/filter-functions/price";
import { getSortedProducts } from "../../../../helpers/filter-functions/sort";
import { getSearchedProducts } from "../../../../helpers/searchedProducts";
import { AiOutlineHeart } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import { useUserData } from "../../../../contexts/UserDataProvider.js";

import { BsFillStarFill } from "react-icons/bs";
import LazyImage from "../../../../components/LazyImage/LazyImage";

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

  const sortedProducts = useMemo(() => {
    const searchedProducts = getSearchedProducts(state.allProductsFromApi, state.inputSearch);
    const ratedProducts = getRatedProducts(searchedProducts, state.filters.rating);
    const categoryProducts = getCategoryWiseProducts(ratedProducts, state.filters.categories);
    const pricedProducts = getPricedProducts(categoryProducts, state.filters.price);
    return getSortedProducts(pricedProducts, state.filters.sort);
  }, [state.allProductsFromApi, state.inputSearch, state.filters]);

  const handleAddToCart = useCallback((product) => {
    addToCartHandler(product);
  }, [addToCartHandler]);

  const handleWishlist = useCallback((product) => {
    wishlistHandler(product);
  }, [wishlistHandler]);

  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableTilt(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const COLUMN_WIDTH = 312;
  const ROW_HEIGHT = 520;
  
  const containerRef = useRef(null);
  const [numColumns, setNumColumns] = useState(3);
  
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const columns = Math.floor(width / COLUMN_WIDTH);
        setNumColumns(Math.max(1, columns));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const rowCount = Math.ceil(sortedProducts.length / numColumns);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * numColumns + columnIndex;
    const product = sortedProducts[index];

    if (!product) return null;

    const isFirstProduct = index === 0;
    
    return (
      <div style={style}>
        {isFirstProduct ? (
          <div className="product-card">
            <Link to={`/product-details/${product.id}`}>
              <div className="product-card-image">
                <LazyImage 
                  src={product.img} 
                  alt={product.name}
                  className="product-image"
                  aspectRatio="1/1"
                  priority={true}
                />
              </div>
            </Link>
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

            <div className="product-card-buttons">
              <button
                disabled={cartLoading}
                onClick={() => handleAddToCart(product)}
                className={`cart-btn ${isProductInCart(product) ? "in-cart" : ""}`}
              >
                {!isProductInCart(product) ? "Add To Cart" : "Go to Cart"}
              </button>
              <button
                onClick={() => handleWishlist(product)}
                className="wishlist-btn"
              >
                {!isProductInWishlist(product) ? (
                  <AiOutlineHeart size={30} />
                ) : (
                  <AiTwotoneHeart
                    color="red"
                    size={30}
                  />
                )}
              </button>
            </div>
          </div>
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
            <div className="product-card">
              <Link to={`/product-details/${product.id}`}>
                <div className="product-card-image">
                  <Tilt
                    tiltMaxAngleX={20}
                    tiltMaxAngleY={20}
                    perspective={800}
                    transitionSpeed={1500}
                    scale={1.1}
                    gyroscope={false}
                    tiltReverse={true}
                  >
                    <LazyImage 
                      src={product.img} 
                      alt={product.name}
                      className="product-image"
                      aspectRatio="1/1"
                      priority={index < 4}
                    />
                  </Tilt>
                </div>
              </Link>

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

              <div className="product-card-buttons">
                <button
                  disabled={cartLoading}
                  onClick={() => handleAddToCart(product)}
                  className={`cart-btn ${isProductInCart(product) ? "in-cart" : ""}`}
                >
                  {!isProductInCart(product) ? "Add To Cart" : "Go to Cart"}
                </button>
                <button
                  onClick={() => handleWishlist(product)}
                  className="wishlist-btn"
                >
                  {!isProductInWishlist(product) ? (
                    <AiOutlineHeart size={30} />
                  ) : (
                    <AiTwotoneHeart
                      color="red"
                      size={30}
                    />
                  )}
                </button>
              </div>
            </div>
          </Tilt>
        )}
      </div>
    );
  };

  if (!sortedProducts.length) {
    return <div>No products found</div>;
  }

  return (
    <div ref={containerRef} className="product-listing-section">
      <FixedSizeGrid
        className="products-grid"
        columnCount={numColumns}
        columnWidth={COLUMN_WIDTH}
        height={window.innerHeight - 100}
        rowCount={rowCount}
        rowHeight={ROW_HEIGHT}
        width={containerRef.current?.offsetWidth || window.innerWidth - 300}
      >
        {Cell}
      </FixedSizeGrid>
    </div>
  );
};
