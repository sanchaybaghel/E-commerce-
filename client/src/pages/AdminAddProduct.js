import React, { useRef, useState } from 'react';
import axios from '../api/axios'; // <-- use your custom axios instance

export default function AdminAddProduct() {
  const [form, setForm] = useState({ name: '', price: '', description: '', images: [] });
  const fileInputRef = useRef();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('description', form.description);
    form.images.forEach(img => data.append('images', img));
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      await axios.post('/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product uploaded!');
      setForm({ name: '', price: '', description: '', images: [] });
      fileInputRef.current.value = ''; // <-- clear file input
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input
        name="images"
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files) }))}
        className="p-2 border rounded w-full"
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}