import axios from "axios";

export const getAllCategories = async () => await axios.get("/api/categories");

export const getAllProducts = async (page = 1, limit = 12) => {
  try {
    // If you're using MockBee or a similar mock backend, 
    // you might need to implement pagination there
    const response = await axios.get(
      `/api/products?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
};
