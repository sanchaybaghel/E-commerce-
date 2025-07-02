import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { getProfile } from '../api/user';

function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items and user addresses on mount
    getCart().then(res => setCart(res.data.cart || []));
    getProfile().then(res => setAddresses(res.data.addresses || []));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await axios.post('/api/payment/create-payment-intent', { amount: total });
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!');
        setTimeout(() => navigate('/orders'), 1500);
      }
    } catch (err) {
      setMessage('Payment failed.');
    }
    setLoading(false);
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4 font-semibold">Total: ₹{total}</div>
      
      <div className="mb-4">
        <label className="font-semibold">Select Address:</label>
        <select
          value={selectedAddress}
          onChange={handleAddressChange}
          className="block w-full p-2 border rounded"
          required
        >
          <option value="">Select address</option>
          {addresses.map(addr => (
            <option key={addr._id} value={addr._id}>
              {addr.label}: {addr.street}, {addr.city}, {addr.state}, {addr.zip}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElement className="p-2 border rounded mb-4" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
}

export default CheckoutPage;