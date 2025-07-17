import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCart } from '../api/cart';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch cart item count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const res = await getCart();
          const totalItems = res.data.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemCount(totalItems);
        } catch (error) {
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-medium border-b border-secondary-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary-900 hidden sm:block">
                E-Commerce
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 pr-4"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/cart" className="relative flex items-center space-x-1 text-secondary-700 hover:text-primary-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2m5 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2" />
              </svg>
              <span className="hidden xl:block">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden xl:block">Wishlist</span>
            </Link>

            <Link to="/orders" className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden xl:block">Orders</span>
            </Link>

            {(user?.role === 'shopkeeper' || user?.role === 'admin') && (
              <Link to="/upload-product" className="text-secondary-700 hover:text-primary-600 transition-colors">
                Upload Product
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="text-secondary-700 hover:text-primary-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-secondary-700 hover:text-primary-600 transition-colors">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden xl:block">{user.name || 'Profile'}</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-accent btn-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-secondary-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-secondary-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 pr-4"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/cart"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2m5 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2" />
                </svg>
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Wishlist</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Orders</span>
              </Link>

              {(user?.role === 'shopkeeper' || user?.role === 'admin') && (
                <Link
                  to="/upload-product"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload Product</span>
                </Link>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Admin Dashboard</span>
                  </Link>
                  <div className="pl-8 space-y-1">
                    <Link
                      to="/admin/products"
                      className="block px-3 py-2 rounded-md text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-3 py-2 rounded-md text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 rounded-md text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/coupons"
                      className="block px-3 py-2 rounded-md text-sm text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Coupons
                    </Link>
                  </div>
                </>
              )}

              {!user && (
                <div className="pt-4 border-t border-secondary-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;