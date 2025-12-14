import API from './api';

export const productService = {
  getAllProducts: async () => {
    const response = await API.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (search) => {
    const response = await API.get('/products', { params: { search } });
    return response.data;
  },

  filterProducts: async (minPrice, maxPrice, minRating, maxRating) => {
    const response = await API.get('/products', {
      params: { minPrice, maxPrice, minRating, maxRating }
    });
    return response.data;
  },

  sortProducts: async (sortBy, order) => {
    const response = await API.get('/products', { params: { sortBy, order } });
    return response.data;
  }
};

