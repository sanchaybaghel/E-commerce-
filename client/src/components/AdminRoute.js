import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // You should set user role in localStorage after login
  return token && user.role === 'admin' ? children : <Navigate to="/login" />;
}

export default AdminRoute;