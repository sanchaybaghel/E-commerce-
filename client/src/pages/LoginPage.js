import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import { syncUser } from '../api/sync'; 
import axios from '../api/axios';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Authenticate with Firebase
      const userCredential = await login(form.email, form.password);

      // Step 2: Get the Firebase ID token
      const token = await userCredential.user.getIdToken();
      console.log("token",token)

      if (!token) {
        throw new Error("No token retrieved from Firebase!");
      }

      // Step 3: Send token to backend to set cookie
      await axios.post(
        '/api/auth/set-cookie',
        { token },
        { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Step 4: Sync user with backend
      const res = await syncUser();
      const userFromBackend = res.data.user;

      localStorage.setItem('user', JSON.stringify(userFromBackend));
      setUser(userFromBackend);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-14 p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-2xl font-extrabold mb-6 text-primary-700 tracking-tight">Sign in to your account</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <div className="flex justify-end mb-2">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-4 py-2 rounded-lg w-full shadow"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="flex items-center w-full my-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-3 text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <Link
        to="/register"
        className="w-full text-center bg-gray-100 hover:bg-gray-200 transition-colors text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-200 shadow"
      >
        Sign up for an account
      </Link>
    </div>
  );
}

export default LoginPage;