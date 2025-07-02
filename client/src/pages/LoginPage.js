import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import { syncUser } from '../api/sync'; // <-- import your syncUser API

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await login(form.email, form.password);
      const token = await userCredential.user.getIdToken();

      // Sync with backend to get full user info (including role)
      const res = await syncUser(token); // <-- this should call /api/auth/sync-user
      const userFromBackend = res.data.user;

      // Save to localStorage and context
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userFromBackend));
      setUser(userFromBackend);
      console.log("user",userFromBackend)

      toast.success('Login successful!');
      setLoading(false);
      navigate('/');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Login failed. Try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      or <Link to={"/forgot-password"}>Forgot Password</Link>
    </div>
  );
}

export default LoginPage;