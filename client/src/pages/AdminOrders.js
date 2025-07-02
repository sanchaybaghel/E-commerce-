import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../api/order';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term (order ID, customer name, email)
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed': return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'Processing': return <ArrowPathIcon className="h-5 w-5 text-yellow-500" />;
      case 'Shipped': return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'Out for Delivery': return <TruckIcon className="h-5 w-5 text-indigo-500" />;
      case 'Delivered': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Failed Delivery': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'Cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'Return Requested': return <ArrowPathIcon className="h-5 w-5 text-orange-500" />;
      case 'Return Approved': return <CheckCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'Return Rejected': return <XCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'Refund Processed': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'Exchange Requested': return <ArrowPathIcon className="h-5 w-5 text-indigo-500" />;
      case 'Exchange Approved': return <CheckCircleIcon className="h-5 w-5 text-indigo-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
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
      case 'Refund Processed': return 'bg-green-100 text-green-800';
      case 'Exchange Requested': return 'bg-indigo-100 text-indigo-800';
      case 'Exchange Approved': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map(order => order.status))];
    return statuses.sort();
  };

  const getPriorityLevel = (status) => {
    const highPriority = ['Return Requested', 'Exchange Requested', 'Failed Delivery'];
    const mediumPriority = ['Placed', 'Processing'];

    if (highPriority.includes(status)) return 'high';
    if (mediumPriority.includes(status)) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enterprise Admin Header */}
      <div className="bg-slate-800 shadow-lg">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-2 rounded-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">E-Commerce Admin</h1>
                  <p className="text-slate-300 text-sm">Order Management Console</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex space-x-8 ml-8">
                <a href="#" className="text-orange-400 border-b-2 border-orange-400 pb-2 text-sm font-medium">
                  Orders
                </a>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Products
                </a>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Customers
                </a>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Settings
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 rounded-lg px-3 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-200 text-sm font-medium">Live</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Last Sync</p>
                <p className="text-slate-200 text-sm font-medium">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="bg-slate-700 rounded-full p-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-slate-600 text-lg mt-4 font-medium">Loading order data...</p>
            </div>
          </div>
        )}{/* Enterprise Dashboard Metrics */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Orders Card */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">TOTAL ORDERS</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">All time</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-sm">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                <div className="flex items-center text-xs">
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-slate-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            {/* Pending Orders Card */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">PENDING</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {orders.filter(o => ['Placed', 'Processing'].includes(o.status)).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Requires action</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-sm">
                    <ClockIcon className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-4 py-2 border-t border-orange-200">
                <div className="flex items-center text-xs">
                  <span className="text-orange-600 font-medium">Action needed</span>
                </div>
              </div>
            </div>

            {/* Critical Issues Card */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CRITICAL</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {orders.filter(o => ['Return Requested', 'Exchange Requested', 'Failed Delivery'].includes(o.status)).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Immediate attention</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-sm">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-red-50 px-4 py-2 border-t border-red-200">
                <div className="flex items-center text-xs">
                  <span className="text-red-600 font-medium">High priority</span>
                </div>
              </div>
            </div>

            {/* Completed Orders Card */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">COMPLETED</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {orders.filter(o => ['Delivered', 'Refund Processed'].includes(o.status)).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Successfully fulfilled</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-sm">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 px-4 py-2 border-t border-green-200">
                <div className="flex items-center text-xs">
                  <span className="text-green-600 font-medium">
                    {orders.length > 0 ? Math.round((orders.filter(o => ['Delivered', 'Refund Processed'].includes(o.status)).length / orders.length) * 100) : 0}% completion rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Control Panel */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm mb-6">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">ORDER MANAGEMENT CONSOLE</h3>
                <p className="text-xs text-slate-600 mt-1">Advanced filtering and search capabilities</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Total Records:</span>
                <span className="text-sm font-bold text-slate-900">{orders.length}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
              {/* Search Input */}
              <div className="lg:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">SEARCH ORDERS</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Order ID, Customer Name, Email, Phone Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">STATUS FILTER</label>
                <div className="relative">
                  <FunnelIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    {getUniqueStatuses().map(status => (
                      <option key={status} value={status}>
                        {status} ({orders.filter(o => o.status === status).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Action Filters */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">QUICK FILTERS</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ALL ({orders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Placed')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'Placed'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  NEW ({orders.filter(o => o.status === 'Placed').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Processing')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'Processing'
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  PROCESSING ({orders.filter(o => o.status === 'Processing').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Return Requested')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'Return Requested'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  RETURNS ({orders.filter(o => o.status === 'Return Requested').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Exchange Requested')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'Exchange Requested'
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  EXCHANGES ({orders.filter(o => o.status === 'Exchange Requested').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Delivered')}
                  className={`px-3 py-1 text-xs font-medium border rounded-sm transition-colors ${
                    statusFilter === 'Delivered'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  COMPLETED ({orders.filter(o => o.status === 'Delivered').length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Data Grid */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  ORDER DATA GRID ({filteredOrders.length})
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {filteredOrders.length === orders.length
                    ? `Displaying all ${orders.length} records`
                    : `Filtered view: ${filteredOrders.length} of ${orders.length} records`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-sm transition-colors">
                  EXPORT CSV
                </button>
                <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-sm transition-colors">
                  BULK ACTIONS
                </button>
                <button className="px-3 py-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-sm transition-colors">
                  REFRESH
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded border-slate-400 text-orange-500 focus:ring-orange-500 bg-slate-700" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    AMOUNT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    DATE/TIME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-slate-400">
                        <svg className="mx-auto h-8 w-8 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wide">
                          {orders.length === 0 ? 'NO DATA AVAILABLE' : 'NO MATCHING RECORDS'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {orders.length === 0
                            ? 'System is ready. Orders will populate when customers place them.'
                            : 'Adjust search parameters or clear filters to view more records.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className={`hover:bg-slate-50 transition-colors text-sm ${
                        getPriorityLevel(order.status) === 'high' ? 'bg-red-50 border-l-2 border-red-500' :
                        getPriorityLevel(order.status) === 'medium' ? 'bg-orange-50 border-l-2 border-orange-500' :
                        'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {order.items?.length || 0} items
                          </div>
                          {order.trackingNumber && (
                            <div className="text-xs text-orange-600 font-medium">
                              TRK: {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6">
                            <div className="h-6 w-6 rounded-sm bg-slate-200 flex items-center justify-center">
                              <span className="text-xs font-bold text-slate-600">
                                {(order.user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-xs font-medium text-slate-900">
                              {order.user?.name || 'Unknown Customer'}
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-32">
                              {order.user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2 bg-slate-400"></div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${
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
                        {getPriorityLevel(order.status) === 'high' && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1 py-0.5 rounded-sm text-xs font-bold bg-red-600 text-white">
                              URGENT
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-900">
                          ₹{order.total?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-slate-500">
                          {order.items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </div>
                        <div className="text-xs">
                          {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour12: false })}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center space-x-1">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center px-2 py-1 border border-slate-300 rounded-sm text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            MANAGE
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;