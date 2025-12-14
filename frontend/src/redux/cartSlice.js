import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
    },
    addCartItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.productId === item.productId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setCartItems, addCartItem, removeCartItem, clearCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;

