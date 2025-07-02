import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, CubeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import axios from '../api/axios';

function SuccessPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get('/api/orders/latest');
        setOrder(res.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Payment Successful!</h1>
          <p className="text-secondary-600 mb-6">Thank you for your purchase. Your order is being processed.</p>
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = order.total || order.amount || 0;

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-success-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Payment Successful!</h1>
          <p className="text-secondary-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <CubeIcon className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-secondary-900">Order Details</h2>
          </div>

          <div className="space-y-4">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-secondary-100 last:border-b-0">
                <div>
                  <h3 className="font-medium text-secondary-900">
                    {item.product?.name || 'Product'}
                  </h3>
                  <p className="text-sm text-secondary-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-secondary-900">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t border-secondary-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-secondary-900">Total Amount</span>
                <span className="text-lg font-semibold text-secondary-900">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-secondary-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  {order.status || 'Confirmed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="btn-primary flex items-center justify-center"
          >
            View My Orders
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="btn-secondary flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;