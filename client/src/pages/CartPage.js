import { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartItem, createCartCheckoutSession } from '../api/cart';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setMessage('Failed to remove item from cart.');
    }
  };

  const handleUpdate = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage('Failed to update item quantity.');
    }
  };

  const handleCheckout = async () => {
    try {
      setMessage('Redirecting to payment...');

      // Create Stripe checkout session
      const response = await createCartCheckoutSession();
      const sessionId = response.data.id;

      // Redirect to Stripe Checkout
      const stripe = await loadStripe('pk_test_51ReoWIC6S3BlDwObLYOZYbGwJWt88B50I3HSeEmGNsGR6onTPcTfUo5K8WMYYRsG3XFoJxE0TRzcbdDvlWlrOd2B00OozLk3iz');
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        setMessage('Payment redirect failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || 'Checkout failed. Please try again.';
      setMessage(errorMessage);
    }
  };



  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900">Shopping Cart</h1>
          <span className="ml-4 badge-primary">{cart.length} items</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-secondary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2m5 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2" />
              </svg>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Your cart is empty</h3>
              <p className="text-secondary-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link to="/" className="btn-primary btn-lg">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-secondary-900">Cart Items</h2>
                </div>
                <div className="divide-y divide-secondary-200">
                  {cart.map(item => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || item.product.image || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-lg font-medium text-secondary-900 hover:text-primary-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-secondary-600 mt-1">
                            {item.product.category}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-lg font-semibold text-secondary-900">
                              ₹{item.product.price?.toLocaleString()}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="text-sm text-secondary-500 line-through ml-2">
                                ₹{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-secondary-300 rounded-lg">
                            <button
                              onClick={() => handleUpdate(item.product._id, Math.max(1, item.quantity - 1))}
                              className="p-2 hover:bg-secondary-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => handleUpdate(item.product._id, Math.max(1, Number(e.target.value)))}
                              className="w-16 text-center border-0 focus:ring-0 py-2"
                            />
                            <button
                              onClick={() => handleUpdate(item.product._id, item.quantity + 1)}
                              className="p-2 hover:bg-secondary-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item.product._id)}
                            className="p-2 text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-semibold text-secondary-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-secondary-900">Order Summary</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Subtotal</span>
                      <span className="font-medium">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Shipping</span>
                      <span className="font-medium text-success-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tax</span>
                      <span className="font-medium">₹{Math.round(total * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-secondary-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-secondary-900">Total</span>
                        <span className="text-lg font-semibold text-secondary-900">
                          ₹{Math.round(total * 1.18).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn-primary btn-lg w-full mt-6"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/"
                    className="btn-secondary btn-md w-full mt-3"
                  >
                    Continue Shopping
                  </Link>

                  {message && (
                    <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                      <p className="text-success-800 text-sm">{message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;