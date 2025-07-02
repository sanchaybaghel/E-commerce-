import React, { useEffect, useState } from 'react';
import { getMyOrders, updateCustomerOrderStatus } from '../api/order';
import { ClockIcon, CheckCircleIcon, TruckIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, reasonText = '') => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));

    try {
      const response = await updateCustomerOrderStatus(orderId, newStatus, reasonText);
      toast.success(response.data.message);

      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Close modal and reset form
      setShowReasonModal(false);
      setReason('');
      setSelectedOrder(null);
      setSelectedAction('');
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const openReasonModal = (orderId, action) => {
    setSelectedOrder(orderId);
    setSelectedAction(action);
    setShowReasonModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'Processing': return <ArrowPathIcon className="h-5 w-5 text-yellow-500" />;
      case 'Shipped': return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'Delivered': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'Return Requested': return <ArrowPathIcon className="h-5 w-5 text-orange-500" />;
      case 'Exchange Requested': return <ArrowPathIcon className="h-5 w-5 text-indigo-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Return Requested': return 'bg-orange-100 text-orange-800';
      case 'Exchange Requested': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailableActions = (status) => {
    switch (status) {
      case 'Placed':
      case 'Processing':
        return [{ action: 'Cancelled', label: 'Cancel Order', color: 'btn-danger', needsReason: true }];
      case 'Delivered':
        // Check if return/exchange window is still open (30 days)
        const deliveryDate = new Date(); // In real app, get from order history
        const daysSinceDelivery = Math.floor((new Date() - deliveryDate) / (1000 * 60 * 60 * 24));

        if (daysSinceDelivery <= 30) {
          return [
            { action: 'Return Requested', label: 'Request Return', color: 'btn-warning', needsReason: true },
            { action: 'Exchange Requested', label: 'Request Exchange', color: 'btn-secondary', needsReason: true }
          ];
        }
        return []; // Window expired
      case 'Shipped':
      case 'Out for Delivery':
        return []; // Cannot take action once shipped
      case 'Return Requested':
      case 'Exchange Requested':
        return []; // Cannot cancel requests once made
      case 'Return Approved':
      case 'Exchange Approved':
        return []; // Admin controlled
      case 'Cancelled':
      case 'Refund Processed':
        return []; // Final states
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Customer-friendly header with shopping theme */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                <p className="text-gray-600">Track your purchases and manage returns easily</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
                <p className="text-sm text-gray-500">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">{loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-lg mt-4 font-medium">Loading your orders...</p>
              <p className="text-gray-400 text-sm">This won't take long</p>
            </div>
          </div>
        )}

        {!loading && orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-100">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet!</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Ready to start your shopping journey? <br />
                Discover amazing products waiting for you!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping Now
              </a>
            </div>
          </div>
        ) : !loading && (
          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                {/* Order Header - Customer-friendly design */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <h3 className="text-xl font-bold">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-blue-100">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          {getStatusIcon(order.status)}
                        </div>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status progress indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{
                        width: order.status === 'Placed' ? '20%' :
                               order.status === 'Processing' ? '40%' :
                               order.status === 'Shipped' ? '60%' :
                               order.status === 'Out for Delivery' ? '80%' :
                               order.status === 'Delivered' ? '100%' : '20%'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Items with visual appeal */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 truncate">
                            {item.product?.name || 'Product'}
                          </h4>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              Qty: {item.quantity}
                            </span>
                            <span>₹{(item.product?.price || 0).toLocaleString()} each</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total and Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                      {/* Total */}
                      <div className="text-center lg:text-left">
                        <p className="text-gray-600 text-lg">Order Total</p>
                        <p className="text-4xl font-bold text-gray-900">
                          ₹{order.total?.toLocaleString() || 0}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        {getAvailableActions(order.status).length === 0 ? (
                          <div className="text-center lg:text-right">
                            <div className="bg-gray-100 rounded-xl p-4">
                              <p className="text-gray-600 font-medium">All set! 🎉</p>
                              <p className="text-gray-500 text-sm">No actions needed right now</p>
                            </div>
                          </div>
                        ) : (
                          getAvailableActions(order.status).map((actionItem, index) => (
                            <button
                              key={index}
                              onClick={() => actionItem.needsReason ? openReasonModal(order._id, actionItem.action) : handleStatusUpdate(order._id, actionItem.action)}
                              disabled={actionLoading[order._id]}
                              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                                actionItem.color === 'btn-danger'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                  : actionItem.color === 'btn-warning'
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                              } ${actionLoading[order._id] ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                            >
                              {actionLoading[order._id] ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  Processing...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  {actionItem.label}
                                </div>
                              )}
                            </button>
                          ))
                        )}

                        {/* View Details Button */}
                        <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer-friendly Reason Modal */}
        {showReasonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl px-6 py-4">
                <div className="flex items-center text-white">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedAction === 'Cancelled' ? 'Cancel Your Order' :
                       selectedAction === 'Return Requested' ? 'Request a Return' :
                       'Request an Exchange'}
                    </h3>
                    <p className="text-blue-100 text-sm">Help us understand your request</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-700 text-lg mb-4">
                    {selectedAction === 'Cancelled'
                      ? "We're sorry to see you cancel this order. Could you tell us why?"
                      : selectedAction === 'Return Requested'
                      ? "We want to make this right. What's the reason for your return?"
                      : "Let us know why you'd like to exchange this item."
                    }
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your reason (required)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      rows="4"
                      placeholder={
                        selectedAction === 'Cancelled'
                          ? "e.g., Found a better price, changed my mind, ordered by mistake..."
                          : selectedAction === 'Return Requested'
                          ? "e.g., Item damaged, wrong size, not as described..."
                          : "e.g., Wrong color, different size needed, defective item..."
                      }
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This helps us improve our service and process your request faster.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowReasonModal(false);
                      setReason('');
                      setSelectedOrder(null);
                      setSelectedAction('');
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-200"
                    disabled={actionLoading[selectedOrder]}
                  >
                    Never Mind
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder, selectedAction, reason)}
                    className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      reason.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } ${actionLoading[selectedOrder] ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                    disabled={actionLoading[selectedOrder] || !reason.trim()}
                  >
                    {actionLoading[selectedOrder] ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm Request
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;