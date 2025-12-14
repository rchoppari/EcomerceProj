import API from './api';

export const orderService = {
  getTaxRate: async (country) => {
    const response = await API.get(`/order/tax-on-product/${country}`);
    return response.data;
  },

  placeOrder: async (items, deliveryAddress, cardNumber, cardHolderName, expiryDate, cvv) => {
    const response = await API.post('/order', {
      items,
      deliveryAddress,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvv
    });
    return response.data;
  },

  getOrderedItems: async () => {
    const response = await API.get('/order/ordered-items');
    return response.data;
  }
};

