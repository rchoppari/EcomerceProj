import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

const initialState = {
  user: authService.getUser(),
  isLoggedIn: authService.isLoggedIn(),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      authService.logout();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

