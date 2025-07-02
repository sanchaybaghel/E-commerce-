import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api/product';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted!');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>
      <Link to="/admin/products/add" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Add Product</Link>
      <ul>
        {products.map(product => (
          <li key={product._id} className="flex justify-between items-center border-b py-2">
            <span>{product.name}</span>
            <div>
              <Link to={`/admin/products/edit/${product._id}`} className="text-green-600 mr-2">Edit</Link>
              <button onClick={() => handleDelete(product._id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminProducts;