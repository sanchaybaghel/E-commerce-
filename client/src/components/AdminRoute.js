import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // You should set user role in localStorage after login
  return user.role === 'admin' ? children : <Navigate to="/login" />;
}

export default AdminRoute;