import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });

  useEffect(() => {
    // Simulate loading dashboard stats
    // In a real app, you'd fetch this from your API
    setStats({
      totalOrders: 1247,
      totalProducts: 89,
      totalUsers: 342,
      totalRevenue: 125430,
      pendingOrders: 23,
      lowStockProducts: 7
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enterprise Admin Header */}
      <div className="bg-slate-800 shadow-lg">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-2 rounded-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">E-Commerce Admin</h1>
                  <p className="text-slate-300 text-sm">Business Intelligence Dashboard</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex space-x-8 ml-8">
                <a href="#" className="text-orange-400 border-b-2 border-orange-400 pb-2 text-sm font-medium">
                  Dashboard
                </a>
                <Link to="/admin/orders" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Orders
                </Link>
                <Link to="/admin/products" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Products
                </Link>
                <Link to="/admin/users" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Customers
                </Link>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="text-slate-300 hover:text-white pb-2 text-sm font-medium">
                  Settings
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 rounded-sm px-3 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-200 text-sm font-medium">Live</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Last Sync</p>
                <p className="text-slate-200 text-sm font-medium">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</p>
              </div>
              <div className="bg-slate-700 rounded-sm p-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full px-6 py-6">
        {/* Enterprise Dashboard Overview */}
        <div className="mb-8">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">BUSINESS OVERVIEW</h2>
              <p className="text-xs text-slate-600 mt-1">Real-time performance metrics and key indicators</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">TOTAL REVENUE</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">+15.3% from last month</p>
                    </div>
                    <div className="bg-green-500 p-2 rounded-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">TOTAL ORDERS</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalOrders.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 mt-1">+8.2% from last month</p>
                    </div>
                    <div className="bg-blue-500 p-2 rounded-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Products */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">TOTAL PRODUCTS</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalProducts}</p>
                      <p className="text-xs text-purple-600 mt-1">{stats.lowStockProducts} low stock items</p>
                    </div>
                    <div className="bg-purple-500 p-2 rounded-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Users */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">TOTAL CUSTOMERS</p>
                      <p className="text-2xl font-bold text-orange-900 mt-1">{stats.totalUsers}</p>
                      <p className="text-xs text-orange-600 mt-1">+12.7% from last month</p>
                    </div>
                    <div className="bg-orange-500 p-2 rounded-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Management Actions */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
            <div className="border-b border-slate-200 bg-slate-800 px-6 py-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">MANAGEMENT CONSOLE</h3>
              <p className="text-xs text-slate-300 mt-1">Core business operations and administration</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-sm group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">ORDER MANAGEMENT</p>
                      <p className="text-xs text-slate-600">Process orders, track shipments, handle returns</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.pendingOrders > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                        {stats.pendingOrders} PENDING
                      </span>
                    )}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  to="/admin/products"
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-sm group-hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">PRODUCT CATALOG</p>
                      <p className="text-xs text-slate-600">Manage inventory, pricing, and product details</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.lowStockProducts > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                        {stats.lowStockProducts} LOW STOCK
                      </span>
                    )}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-sm group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">CUSTOMER MANAGEMENT</p>
                      <p className="text-xs text-slate-600">View customer profiles, manage accounts</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* System Status & Alerts */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
            <div className="border-b border-slate-200 bg-slate-800 px-6 py-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">SYSTEM STATUS</h3>
              <p className="text-xs text-slate-300 mt-1">Real-time system health and alerts</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* System Health */}
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-bold text-green-900">SYSTEM OPERATIONAL</p>
                      <p className="text-xs text-green-700">All services running normally</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700">99.9% UPTIME</span>
                </div>

                {/* Pending Orders Alert */}
                {stats.pendingOrders > 0 && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold text-orange-900">PENDING ORDERS</p>
                        <p className="text-xs text-orange-700">{stats.pendingOrders} orders require attention</p>
                      </div>
                    </div>
                    <Link to="/admin/orders" className="text-xs font-bold text-orange-700 hover:text-orange-900">
                      VIEW →
                    </Link>
                  </div>
                )}

                {/* Low Stock Alert */}
                {stats.lowStockProducts > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold text-red-900">LOW STOCK ALERT</p>
                        <p className="text-xs text-red-700">{stats.lowStockProducts} products need restocking</p>
                      </div>
                    </div>
                    <Link to="/admin/products" className="text-xs font-bold text-red-700 hover:text-red-900">
                      MANAGE →
                    </Link>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">RECENT ACTIVITY</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">New order #ORD-2024-001</span>
                      <span className="text-slate-400">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Product "Wireless Headphones" updated</span>
                      <span className="text-slate-400">15 min ago</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Customer registration: john@example.com</span>
                      <span className="text-slate-400">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">PERFORMANCE ANALYTICS</h3>
                <p className="text-xs text-slate-600 mt-1">Business intelligence and growth metrics</p>
              </div>
              <button className="text-xs font-medium text-orange-600 hover:text-orange-700 border border-orange-200 px-3 py-1 rounded-sm">
                VIEW FULL REPORT
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">94.2%</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">ORDER FULFILLMENT RATE</div>
                <div className="text-xs text-green-600 mt-1">+2.1% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">₹4,127</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">AVERAGE ORDER VALUE</div>
                <div className="text-xs text-green-600 mt-1">+8.3% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">2.4 days</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">AVERAGE DELIVERY TIME</div>
                <div className="text-xs text-red-600 mt-1">+0.2 days from last month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;