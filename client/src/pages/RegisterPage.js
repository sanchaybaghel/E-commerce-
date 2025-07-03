import { useState } from 'react';
import { toast } from 'react-toastify';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { syncUser } from '../api/sync'; 
import { updateProfile } from "firebase/auth";

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await register(form.email, form.password);
      console.log('userCredential:', userCredential);

      // Use the standalone updateProfile function
      await updateProfile(userCredential.user, { displayName: form.name });

      // Sync user to backend MongoDB
      const token = await userCredential.user.getIdToken();
      await syncUser(token, form.name, form.role); // <-- pass role

      toast.success('Registration successful! Please login.');
      setLoading(false);
      navigate('/login');
    } catch (err) {
      console.log(err);
      toast.error(
        err.message || 'Registration failed. Try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded w-full"
          required
        />
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
        <div>
          <input
            type="checkbox"
            checked={form.role === 'admin'}
            onChange={e => setForm({ ...form, role: e.target.checked ? 'admin' : 'customer' })}
          />
          <label>Register as admin (Admin only)</label>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
