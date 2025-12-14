import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/authentication/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  createAccount: async (firstName, lastName, email, password) => {
    const response = await API.post('/authentication/create-account', {
      firstName,
      lastName,
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  }
};

