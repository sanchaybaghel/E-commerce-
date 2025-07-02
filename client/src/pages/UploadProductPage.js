import React, { useState } from 'react';
import { addProduct } from '../api/product';

export default function UploadProductPage() {
  const [form, setForm] = useState({ name: '', price: '', description: '' ,category:''});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setImages([...e.target.files]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // Build FormData
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('description', form.description);
    data.append('category',form.category)
    images.forEach(img => data.append('images', img)); // field name must match backend

    try {
      await addProduct(data); // Pass FormData, not a plain object!
      alert('Product uploaded!');
      setForm({ name: '', price: '', description: '',category:'' });
      setImages([]);
    } catch (err) {
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="block mb-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required className="block mb-2" />
        <input name='category' value={form.category} onChange={handleChange} placeholder='categeroy' required className='block mb-2'/>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="block mb-2" />
        
        <input
          name="images"
          type="file"
          multiple
          onChange={handleFileChange}
          className="block mb-2"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}