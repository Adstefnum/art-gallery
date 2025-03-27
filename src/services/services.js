import axios from "axios";

export const getAllCategories = async () => await axios.get("/api/categories");

export const getAllProducts = async (page = 1, limit = 12) => {
  try {
    
    const response = await axios.get(
      `/api/products?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
};
