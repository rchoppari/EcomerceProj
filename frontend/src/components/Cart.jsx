import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { setCartItems, removeCartItem } from '../redux/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);
  const { isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadCartItems();
  }, [isLoggedIn]);

  const loadCartItems = async () => {
    try {
      const data = await cartService.getCartItems();
      dispatch(setCartItems(data));
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleRemoveFromCart = async (cartId) => {
    try {
      await cartService.removeFromCart(cartId);
      dispatch(removeCartItem(cartId));
      loadCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items && items.length > 0 && items.map((item) => (
                  <div key={item.cartId} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.productName}</h3>
                      <p className="text-gray-600">
                        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.cartId)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg"
              >
                Order Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

