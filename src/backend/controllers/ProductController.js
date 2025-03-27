import { Response } from "miragejs";

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/products
 * */

export const getAllProductsHandler = function (schema, request) {
  const page = parseInt(request.queryParams.page) || 1;
  const limit = parseInt(request.queryParams.limit) || 12;
  
  const allProducts = this.db.products;
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = allProducts.slice(startIndex, endIndex);
  
  return new Response(200, {}, {
    success: true,
    products: paginatedProducts,
    productsCount: allProducts.length,
    resultPerPage: limit,
    filteredProductsCount: allProducts.length,
  });
};

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/user/products/:productId
 * */

export const getProductHandler = function (schema, request) {
  const productId = request.params.productId;
  try {
    const product = schema.products.findBy({ _id: productId });
    return new Response(200, {}, { product });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};
