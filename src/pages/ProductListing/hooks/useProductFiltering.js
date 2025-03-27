import { useMemo } from 'react';
import { getCategoryWiseProducts } from "../../../helpers/filter-functions/category";
import { getRatedProducts } from "../../../helpers/filter-functions/ratings";
import { getPricedProducts } from "../../../helpers/filter-functions/price";
import { getSortedProducts } from "../../../helpers/filter-functions/sort";
import { getSearchedProducts } from "../../../helpers/searchedProducts";

export const useProductFiltering = (state) => {
  return useMemo(() => {
    const searchedProducts = getSearchedProducts(state.allProductsFromApi, state.inputSearch);
    const ratedProducts = getRatedProducts(searchedProducts, state.filters.rating);
    const categoryProducts = getCategoryWiseProducts(ratedProducts, state.filters.categories);
    const pricedProducts = getPricedProducts(categoryProducts, state.filters.price);
    return getSortedProducts(pricedProducts, state.filters.sort);
  }, [state.allProductsFromApi, state.inputSearch, state.filters]);
}; 