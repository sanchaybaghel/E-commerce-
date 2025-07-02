import { useEffect, useState } from 'react';
import { createCoupon, getCoupons, deleteCoupon } from '../api/coupon';
import { toast } from 'react-toastify';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discount: '' });

  useEffect(() => {
    getCoupons().then(res => setCoupons(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createCoupon(form);
    toast.success('Coupon created!');
    setForm({ code: '', discount: '' });
    getCoupons().then(res => setCoupons(res.data));
  };

  const handleDelete = async (id) => {
    await deleteCoupon(id);
    toast.success('Coupon deleted!');
    setCoupons(coupons.filter(c => c._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Coupons</h2>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          value={form.discount}
          onChange={e => setForm({ ...form, discount: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>
      <ul>
        {coupons.map(coupon => (
          <li key={coupon._id} className="flex justify-between items-center border-b py-2">
            <span>{coupon.code} - {coupon.discount}%</span>
            <button onClick={() => handleDelete(coupon._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCoupons;