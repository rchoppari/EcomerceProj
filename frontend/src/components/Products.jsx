import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { setProducts, setLoading } from '../redux/productSlice';
import { addCartItem } from '../redux/cartSlice';

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector(state => state.products);
  const { isLoggedIn } = useSelector(state => state.auth);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productService.getAllProducts();
      dispatch(setProducts(data));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productService.searchProducts(search);
      dispatch(setProducts(data));
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilter = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productService.filterProducts(
        parseFloat(minPrice) || 0,
        parseFloat(maxPrice) || 10000,
        parseFloat(minRating) || 0,
        parseFloat(maxRating) || 5
      );
      dispatch(setProducts(data));
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSort = async () => {
    dispatch(setLoading(true));
    try {
      const data = await productService.sortProducts(sortBy, order);
      dispatch(setProducts(data));
    } catch (error) {
      console.error('Error sorting products:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(product.id, 1);
      dispatch(addCartItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
        productName: product.name,
        cartId: Math.random()
      }));
      setSuccessMessage(`${product.name} added to cart!`);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Products</h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Search & Filter</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Search
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating Range</label>
                <input
                  type="number"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  placeholder="Min rating"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <input
                  type="number"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  placeholder="Max rating"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleFilter}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Apply Filter
              </button>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <button
                  onClick={handleSort}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Sort
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <p className="text-xl text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description?.substring(0, 60)}...</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                        <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded">
                          ⭐ {product.rating}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

