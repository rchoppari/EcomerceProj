import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const cartCount = items.length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold hover:text-blue-200 transition">
            🛒 E-Commerce
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition font-semibold">
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/orders" className="hover:text-blue-200 transition font-semibold">
                  My Orders
                </Link>

                <Link to="/cart" className="relative hover:text-blue-200 transition font-semibold flex items-center">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{user?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

