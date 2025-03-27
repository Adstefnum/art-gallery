import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from "react";

import { getAllCategories, getAllProducts } from "../services/services";
import { dataReducer, initialState } from "../reducer/dataReducer";

const DataContext = createContext();

const PRODUCTS_PER_PAGE = 12; 

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products with pagination
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await getAllProducts(page, PRODUCTS_PER_PAGE);
      
      if (response.status === 200) {
        const newProducts = response.data.products;
        const total = response.data.total; 
        
        dispatch({
          type: page === 1 ? "SET_PRODUCTS" : "APPEND_PRODUCTS",
          payload: newProducts.map((product, index) => ({
            ...product,
            id: (page - 1) * PRODUCTS_PER_PAGE + index + 1,
          }))
        });

        setHasMore(state.allProductsFromApi.length < total);
        setCurrentPage(page);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [state.allProductsFromApi.length]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchProducts]);

  // Reset products (useful for applying new filters)
  const resetProducts = useCallback(() => {
    dispatch({ type: "RESET_PRODUCTS" });
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1);
  }, [fetchProducts]);

  // Initial data fetch
  React.useEffect(() => {
    fetchProducts(1);
    getAllCategories().then(response => {
      if (response.status === 200) {
        dispatch({
          type: "GET_ALL_CATEGORIES",
          payload: response.data.categories,
        });
      }
    }).catch(console.error);
  }, []);

  const value = {
    state,
    dispatch,
    loading,
    error,
    hasMore,
    loadMoreProducts,
    resetProducts,
    currentPage
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
