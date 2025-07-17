import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, addAddress, removeAddress } from '../api/user';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [address, setAddress] = useState({
    label: '', street: '', city: '', state: '', zip: '', country: '', phone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfile().then(res => {
      setProfile(res.data);
      setForm({ name: res.data.name, email: res.data.email });
    });
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    toast.success('Profile updated!');
    setEdit(false);
    getProfile().then(res => setProfile(res.data));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await addAddress(address);
    toast.success('Address added!');
    setAddress({ label: '', street: '', city: '', state: '', zip: '', country: '', phone: '' });
    getProfile().then(res => setProfile(res.data));
  };

  const handleRemoveAddress = async (id) => {
    await removeAddress(id);
    toast.success('Address removed!');
    getProfile().then(res => setProfile(res.data));
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('user');
    setProfile(null);
    window.location.href = '/login';
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {edit ? (
        <form onSubmit={handleProfileUpdate} className="mb-4">
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded mb-2 w-full"
            placeholder="Name"
          />
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="p-2 border rounded mb-2 w-full"
            placeholder="Email"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      ) : (
        <div className="mb-4">
          <div>Name: {profile.name}</div>
          <div>Email: {profile.email}</div>
          <button onClick={() => setEdit(true)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Edit</button>
        </div>
      )}

      <h3 className="text-xl font-bold mt-6 mb-2">Addresses</h3>
      <ul>
        {profile.addresses?.map(addr => (
          <li key={addr._id} className="mb-2 border-b pb-2">
            <div>{addr.label}: {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country} ({addr.phone})</div>
            <button onClick={() => handleRemoveAddress(addr._id)} className="text-red-600">Remove</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddAddress} className="mt-4">
        <input type="text" placeholder="Label" value={address.label} onChange={e => setAddress({ ...address, label: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="ZIP" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <input type="text" placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="p-2 border rounded mb-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Address</button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;