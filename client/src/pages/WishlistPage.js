import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../api/user';
import { Link } from 'react-router-dom';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    getWishlist().then(res => setWishlist(res.data.wishlist || []));
  }, []);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setWishlist(wishlist.filter(p => p._id !== productId));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      {wishlist.length === 0 ? (
        <div>No items in wishlist.</div>
      ) : (
        <ul>
          {wishlist.map(product => (
            <li key={product._id} className="flex items-center justify-between border-b py-2">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
              <button onClick={() => handleRemove(product._id)} className="text-red-600">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistPage;