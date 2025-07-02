import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, updateCustomerOrderStatus } from '../api/order';
import { ClockIcon, CheckCircleIcon, TruckIcon, XCircleIcon, ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await getOrder(id);
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus, reasonText = '') => {
    setActionLoading(true);

    try {
      const response = await updateCustomerOrderStatus(id, newStatus, reasonText);
      toast.success(response.data.message);

      // Refresh order data
      await fetchOrder();
      setShowReasonModal(false);
      setReason('');
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const openReasonModal = (action) => {
    setSelectedAction(action);
    setShowReasonModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return <ClockIcon className="h-6 w-6 text-blue-500" />;
      case 'Processing': return <ArrowPathIcon className="h-6 w-6 text-yellow-500" />;
      case 'Shipped': return <TruckIcon className="h-6 w-6 text-purple-500" />;
      case 'Delivered': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'Cancelled': return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'Return Requested': return <ArrowPathIcon className="h-6 w-6 text-orange-500" />;
      case 'Exchange Requested': return <ArrowPathIcon className="h-6 w-6 text-indigo-500" />;
      default: return <ClockIcon className="h-6 w-6 text-gray-500" />;
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
      case 'Shipped':
      case 'Delivered':
        return [
          { action: 'Return Requested', label: 'Request Return', color: 'btn-warning', needsReason: true },
          { action: 'Exchange Requested', label: 'Request Exchange', color: 'btn-secondary', needsReason: true }
        ];
      case 'Return Requested':
      case 'Exchange Requested':
        return [{ action: 'Cancelled', label: 'Cancel Request', color: 'btn-secondary', needsReason: false }];
      default:
        return [];
    }
  };

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
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">Order not found</h3>
          <p className="text-secondary-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900">Order Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Order #{order._id.slice(-8)}
                </h2>
                <p className="text-secondary-600 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-secondary-100 last:border-b-0">
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        Quantity: {item.quantity} × ₹{(item.product?.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-secondary-900">
                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-200 mt-6 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{order.total?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="border-t border-secondary-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Order History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {getStatusIcon(history.status)}
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900">{history.status}</p>
                        {history.reason && (
                          <p className="text-sm text-secondary-600">{history.reason}</p>
                        )}
                        <p className="text-xs text-secondary-500">
                          {new Date(history.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-secondary-200 pt-6 mt-6">
              <div className="flex flex-wrap gap-3">
                {getAvailableActions(order.status).map((actionItem, index) => (
                  <button
                    key={index}
                    onClick={() => actionItem.needsReason ? openReasonModal(actionItem.action) : handleStatusUpdate(actionItem.action)}
                    disabled={actionLoading}
                    className={`${actionItem.color} ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading ? 'Processing...' : actionItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reason Modal */}
        {showReasonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">
                {selectedAction === 'Cancelled' ? 'Cancel Order' :
                 selectedAction === 'Return Requested' ? 'Request Return' :
                 'Request Exchange'}
              </h3>
              <p className="text-secondary-600 mb-4">
                Please provide a reason for this action:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                placeholder="Enter your reason..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedAction, reason)}
                  className="btn-primary"
                  disabled={actionLoading || !reason.trim()}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsPage;