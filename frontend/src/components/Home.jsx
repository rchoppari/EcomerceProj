import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to E-Commerce Store
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing products at unbeatable prices. Shop now and enjoy fast delivery!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
              >
                Shop Now
              </button>
              {!isLoggedIn && (
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
                >
                  Create Account
                </button>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-9xl">🛍️</div>
            <p className="text-gray-600 mt-4 text-lg">Your trusted online shopping partner</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered within 7 days</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and encrypted payment processing</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg shadow">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Best Quality</h3>
              <p className="text-gray-600">Premium products with verified ratings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Wireless Headphones', price: '$79.99', emoji: '🎧' },
              { name: 'Smartphone Stand', price: '$19.99', emoji: '📱' },
              { name: 'Wireless Mouse', price: '$34.99', emoji: '🖱️' },
              { name: 'Mechanical Keyboard', price: '$89.99', emoji: '⌨️' }
            ].map((product, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-6xl text-center mb-4">{product.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{product.name}</h3>
                <p className="text-2xl font-bold text-green-600 text-center mb-4">{product.price}</p>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers today</p>
          {!isLoggedIn ? (
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-100 transition"
            >
              Create Account Now
            </button>
          ) : (
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-100 transition"
            >
              Start Shopping
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

