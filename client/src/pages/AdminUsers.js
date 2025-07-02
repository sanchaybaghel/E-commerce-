import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../api/user';
import AdminRoute from '../components/AdminRoute';
import { toast } from 'react-toastify';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted!');
    }
  };

  return (
    <AdminRoute>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} className="flex justify-between items-center border-b py-2">
              <span>{user.name} ({user.email})</span>
              <button onClick={() => handleDelete(user._id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </AdminRoute>
  );
}

export default AdminUsers;