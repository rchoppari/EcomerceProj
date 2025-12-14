import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { setCartItems } from '../redux/cartSlice';

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isLoggedIn]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrderedItems();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAgain = (order) => {
    // Add products back to cart
    const cartItems = [];
    for (let i = 0; i < order.productIds.length; i++) {
      cartItems.push({
        productId: order.productIds[i],
        quantity: order.quantities[i]
      });
    }

    // For demo, we'll just navigate to products
    // In a real app, you'd add these to cart
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-xl text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Order ID</p>
                    <p className="font-bold text-gray-800">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-bold text-gray-800">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="font-bold text-green-600 text-lg">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Payment Method</p>
                    <p className="font-bold text-gray-800">**** {order.cardLastFour}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-gray-800 mb-2">Delivery Address</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-gray-800 mb-2">Items Ordered</p>
                  <div className="bg-gray-50 rounded p-3">
                    {order.productIds && order.productIds.map((productId, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700 mb-1">
                        <span>Product ID: {productId}</span>
                        <span>Qty: {order.quantities[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOrderAgain(order)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Order Again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

