import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states for admin actions
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/user/orders/${id}`);
      setOrder(res.data);
      setSelectedStatus(res.data.status);
      setAdminNotes(res.data.adminNotes || '');
      setTrackingNumber(res.data.trackingNumber || '');
      setEstimatedDelivery(res.data.estimatedDelivery ? res.data.estimatedDelivery.split('T')[0] : '');
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const updateData = {
        status: selectedStatus,
        adminNotes,
        trackingNumber: trackingNumber || undefined,
        estimatedDelivery: estimatedDelivery || undefined
      };

      const response = await axios.put(`/api/orders/${id}/status`, updateData);
      toast.success(response.data.message);
      await fetchOrder(); // Refresh order data
    } catch (error) {
      console.error('Error updating order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return <ClockIcon className="h-6 w-6 text-blue-500" />;
      case 'Processing': return <ArrowPathIcon className="h-6 w-6 text-yellow-500" />;
      case 'Shipped': return <TruckIcon className="h-6 w-6 text-purple-500" />;
      case 'Out for Delivery': return <TruckIcon className="h-6 w-6 text-indigo-500" />;
      case 'Delivered': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'Failed Delivery': return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case 'Cancelled': return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'Return Requested': return <ArrowPathIcon className="h-6 w-6 text-orange-500" />;
      case 'Return Approved': return <CheckCircleIcon className="h-6 w-6 text-orange-500" />;
      case 'Return Rejected': return <XCircleIcon className="h-6 w-6 text-orange-500" />;
      case 'Return Initiated': return <ArrowPathIcon className="h-6 w-6 text-orange-600" />;
      case 'Return in Transit': return <TruckIcon className="h-6 w-6 text-orange-600" />;
      case 'Return Delivered': return <CheckCircleIcon className="h-6 w-6 text-orange-600" />;
      case 'Refund Processed': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'Exchange Requested': return <ArrowPathIcon className="h-6 w-6 text-indigo-500" />;
      case 'Exchange Approved': return <CheckCircleIcon className="h-6 w-6 text-indigo-500" />;
      case 'Exchange Rejected': return <XCircleIcon className="h-6 w-6 text-indigo-500" />;
      case 'Exchange Initiated': return <ArrowPathIcon className="h-6 w-6 text-indigo-600" />;
      case 'Exchange in Transit': return <TruckIcon className="h-6 w-6 text-indigo-600" />;
      case 'Exchange Delivered': return <CheckCircleIcon className="h-6 w-6 text-indigo-600" />;
      case 'Exchange Failed': return <XCircleIcon className="h-6 w-6 text-indigo-600" />;
      default: return <ClockIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Failed Delivery': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Return Requested': return 'bg-orange-100 text-orange-800';
      case 'Return Approved': return 'bg-orange-100 text-orange-800';
      case 'Return Rejected': return 'bg-orange-100 text-orange-800';
      case 'Return Initiated': return 'bg-orange-100 text-orange-800';
      case 'Return in Transit': return 'bg-orange-100 text-orange-800';
      case 'Return Delivered': return 'bg-orange-100 text-orange-800';
      case 'Refund Processed': return 'bg-green-100 text-green-800';
      case 'Exchange Requested': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Approved': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Rejected': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Initiated': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange in Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Delivered': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Failed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLevel = (status) => {
    const highPriority = ['Return Requested', 'Exchange Requested', 'Failed Delivery'];
    const mediumPriority = ['Placed', 'Processing'];

    if (highPriority.includes(status)) return 'high';
    if (mediumPriority.includes(status)) return 'medium';
    return 'low';
  };

  const getAvailableStatuses = (currentStatus) => {
    const adminWorkflow = {
      'Placed': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Out for Delivery', 'Delivered', 'Return Initiated'],
      'Out for Delivery': ['Delivered', 'Failed Delivery'],
      'Delivered': ['Return Initiated', 'Exchange Initiated'],
      'Failed Delivery': ['Shipped', 'Return Initiated'],
      'Return Requested': ['Return Approved', 'Return Rejected'],
      'Return Approved': ['Return Initiated', 'Return Rejected'],
      'Return Initiated': ['Return in Transit', 'Return Cancelled'],
      'Return in Transit': ['Return Delivered', 'Return Failed'],
      'Return Delivered': ['Refund Processed'],
      'Exchange Requested': ['Exchange Approved', 'Exchange Rejected'],
      'Exchange Approved': ['Exchange Initiated'],
      'Exchange Initiated': ['Exchange in Transit'],
      'Exchange in Transit': ['Exchange Delivered', 'Exchange Failed'],
      'Cancelled': [],
      'Refund Processed': []
    };

    return adminWorkflow[currentStatus] || [];
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
          <p className="text-secondary-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/admin/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enterprise Admin Header */}
      <div className="bg-slate-800 shadow-lg">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <Link
                to="/admin/orders"
                className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-sm text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <ArrowLeftIcon className="h-3 w-3 mr-2" />
                BACK TO ORDERS
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-2 rounded-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">ORDER MANAGEMENT CONSOLE</h1>
                  <p className="text-slate-300 text-xs">Order ID: #{order?._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Last Sync</p>
                <p className="text-slate-200 text-sm font-medium">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</p>
              </div>
              <div className="bg-slate-700 rounded-sm px-3 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-200 text-xs font-medium">LIVE</span>
                </div>
              </div>
              <div className="bg-slate-700 rounded-sm p-2">
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full px-6 py-6">{loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-orange-500 mx-auto"></div>
              <p className="text-slate-600 text-lg mt-4 font-medium">Loading order details...</p>
            </div>
          </div>
        )}{/* Enterprise Status Panel */}
        {!loading && order && (
          <div className={`border border-slate-200 rounded-sm mb-6 overflow-hidden ${
            getPriorityLevel(order.status) === 'high' ? 'border-l-4 border-l-red-500' :
            getPriorityLevel(order.status) === 'medium' ? 'border-l-4 border-l-orange-500' :
            'border-l-4 border-l-blue-500'
          }`}>
            <div className="bg-slate-800 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    ORDER STATUS MONITOR
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityLevel(order.status) === 'high' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-bold bg-red-600 text-white">
                      CRITICAL
                    </span>
                  )}
                  {getPriorityLevel(order.status) === 'medium' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-bold bg-orange-600 text-white">
                      ACTIVE
                    </span>
                  )}
                  <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${
                    order.status === 'Placed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'Return Requested' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'Exchange Requested' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">PRIORITY LEVEL</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {getPriorityLevel(order.status) === 'high' ? 'HIGH PRIORITY' :
                     getPriorityLevel(order.status) === 'medium' ? 'MEDIUM PRIORITY' :
                     'STANDARD'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ACTION REQUIRED</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {getPriorityLevel(order.status) === 'high' ? 'IMMEDIATE' :
                     getPriorityLevel(order.status) === 'medium' ? 'WITHIN 24H' :
                     'ROUTINE'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">LAST UPDATED</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-900">
                      Order #{order._id.slice(-8)}
                    </h2>
                    <p className="text-secondary-600 mt-1">
                      Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'No email'})
                    </p>
                    <p className="text-secondary-600">
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

                {/* Order Items */}
                <div className="border-t border-secondary-200 pt-6">
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-secondary-100 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <CubeIcon className="h-8 w-8 text-secondary-400" />
                          <div>
                            <h4 className="font-medium text-secondary-900">
                              {item.product?.name || 'Product'}
                            </h4>
                            <p className="text-sm text-secondary-600">
                              Quantity: {item.quantity} × ₹{(item.product?.price || 0).toLocaleString()}
                            </p>
                          </div>
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

                {/* Tracking Information */}
                {(order.trackingNumber || order.estimatedDelivery) && (
                  <div className="border-t border-secondary-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-secondary-900 mb-4">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.trackingNumber && (
                        <div className="flex items-center space-x-2">
                          <TruckIcon className="h-5 w-5 text-secondary-400" />
                          <span className="text-sm text-secondary-600">Tracking:</span>
                          <span className="font-medium">{order.trackingNumber}</span>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-secondary-400" />
                          <span className="text-sm text-secondary-600">Est. Delivery:</span>
                          <span className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Notes */}
                {order.customerNotes && (
                  <div className="border-t border-secondary-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">Customer Notes</h3>
                    <p className="text-secondary-700 bg-secondary-50 p-3 rounded-md">{order.customerNotes}</p>
                  </div>
                )}

                {/* Admin Notes */}
                {order.adminNotes && (
                  <div className="border-t border-secondary-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">Admin Notes</h3>
                    <p className="text-secondary-700 bg-blue-50 p-3 rounded-md">{order.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Admin Actions</h3>

              <div className="space-y-4">
                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={order.status}>{order.status} (Current)</option>
                    {getAvailableStatuses(order.status).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full p-3 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Estimated Delivery */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full p-3 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    placeholder="Add internal notes..."
                    className="w-full p-3 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Update Button */}
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || selectedStatus === order.status}
                  className={`w-full btn-primary ${updating || selectedStatus === order.status ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updating ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mt-6">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.slice().reverse().map((history, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b border-secondary-100 last:border-b-0">
                      {getStatusIcon(history.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary-900">{history.status}</p>
                        {history.reason && (
                          <p className="text-sm text-secondary-600 mt-1">{history.reason}</p>
                        )}
                        {history.adminNotes && (
                          <p className="text-sm text-blue-600 mt-1">Admin: {history.adminNotes}</p>
                        )}
                        <p className="text-xs text-secondary-500 mt-1">
                          {new Date(history.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;