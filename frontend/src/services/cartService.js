import API from './api';

export const cartService = {
  addToCart: async (productId, quantity) => {
    const response = await API.post('/cart', { productId, quantity });
    return response.data;
  },

  getCartItems: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  removeFromCart: async (cartId) => {
    const response = await API.delete(`/cart/${cartId}`);
    return response.data;
  }
};

