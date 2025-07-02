import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import WishlistPage from './pages/WishlistPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ProductProvider } from './context/ProductContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import UploadProductPage from './pages/UploadProductPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AdminUsers from './pages/AdminUsers';
import AdminCoupons from './pages/AdminCoupons';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <div className="min-h-screen bg-secondary-50 flex flex-col">
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastClassName="!bg-white !text-secondary-900 !shadow-medium !border !border-secondary-200"
              />
              <Navbar />
              <main className="flex-1">
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/upload-product" element={
                  <PrivateRoute role={['shopkeeper', 'admin']}>
                    <UploadProductPage />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />

                <Route path="/admin/products" element={
                  <PrivateRoute role="admin">
                    <AdminProducts />
                  </PrivateRoute>
                } />

                <Route path="/admin/products/add" element={
                  <PrivateRoute role="admin">
                    <AdminAddProduct />
                  </PrivateRoute>
                } />

                <Route path="/admin/orders" element={
                  <PrivateRoute role="admin">
                    <AdminOrders />
                  </PrivateRoute>
                } />
                
                <Route path="/admin/orders/:id" element={
                  <PrivateRoute role="admin">
                    <AdminOrderDetails />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute role="admin">
                    <AdminUsers />
                  </PrivateRoute>
                } />
                <Route path="/admin/coupons" element={
                  <PrivateRoute role="admin">
                    <AdminCoupons />
                  </PrivateRoute>
                } />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />
              </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </Elements>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
