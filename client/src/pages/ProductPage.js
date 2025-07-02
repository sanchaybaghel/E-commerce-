import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, addReview, createCheckoutSession } from '../api/product';
import { addToCart } from '../api/cart';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [mainImage, setMainImage] = useState(product?.images?.[0] || product?.image);
  const [form, setForm] = useState({
    stock: 0,
  });

  const handlePayment = async () => {
    const res = await createCheckoutSession(product._id, quantity);
    const stripe = await loadStripe('pk_test_51ReoWIC6S3BlDwObLYOZYbGwJWt88B50I3HSeEmGNsGR6onTPcTfUo5K8WMYYRsG3XFoJxE0TRzcbdDvlWlrOd2B00OozLk3iz');
    await stripe.redirectToCheckout({ sessionId: res.data.id });
  };

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else if (product?.image) {
      setMainImage(product.image);
    }
  }, [product]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, review);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      getProduct(id).then(res => setProduct(res.data)); 
    } catch {
      toast.error('Please login or you already reviewed.');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart');
      // Optionally: navigate('/cart'); // if you want to redirect to cart
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Calculate average rating
  const averageRating =
    product && product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  // Helper to render filled and empty stars
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <>
        {[...Array(5)].map((_, i) =>
          i < rounded ? (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ) : (
            <span key={i} className="text-gray-300 text-lg">★</span>
          )
        )}
      </>
    );
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
     
      {product.images && product.images.length > 0 && (
        <div>
          <img
            src={mainImage}
            alt="Main Product"
            className="w-full h-64 object-cover rounded mb-4"
          />
          <div className="flex gap-2 mb-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${mainImage === img ? 'border-blue-600' : 'border-transparent'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
      )}
    
      {!product.images?.length && product.image && (
        <img src={product.image} alt="Product" className="w-full h-64 object-cover rounded mb-4" />
      )}
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      {averageRating && (
        <div className="mb-2 flex items-center gap-2">
          {renderStars(averageRating)}
          <span className="text-yellow-600 font-semibold">{averageRating} / 5</span>
          <span className="text-gray-600">({product.reviews.length} reviews)</span>
        </div>
      )}
      <p className="text-blue-700 font-semibold mb-2">₹{product.price}</p>
      <p className="mb-2">{product.description}</p>
      <p className="mb-2 text-gray-600">Category: {product.category}</p>
      <p className="mb-2 text-gray-600">
        {product.stock > 0
          ? `In Stock (${product.stock})`
          : <span className="text-red-600 font-bold">Out of Stock</span>
        }
      </p>
      <div className="mb-4">
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-16 p-1 border rounded mr-2"
          disabled={product.stock === 0}
        />
        <button
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
          onClick={handlePayment}
          
        >
          Pay Now
        </button>
      </div>
      {message && <div className="mb-4 text-green-600">{message}</div>}

      <h3 className="text-xl font-bold mt-8 mb-2">Reviews</h3>
      <ul>
        {product.reviews?.map(r => (
          <li key={r._id} className="mb-2 border-b pb-2">
            <strong>{r.name}</strong> - {r.rating}★<br />
            {r.comment}
          </li>
        ))}
      </ul>
      <form onSubmit={handleReview} className="mt-4">
        <label>
          Rating:
          <select
            value={review.rating}
            onChange={e => setReview({ ...review, rating: e.target.value })}
            className="ml-2 p-1 border rounded"
          >
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea
          placeholder="Write a review..."
          value={review.comment}
          onChange={e => setReview({ ...review, comment: e.target.value })}
          className="block w-full mt-2 p-2 border rounded"
          required
        />
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
      </form>
      {product.stock === 0 && (
        <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
          Out of Stock
        </span>
      )}
      <input
        name="stock"
        type="number"
        min="0"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="p-2 border rounded w-full"
        required
      />
    </div>
  );
}

export default ProductPage;