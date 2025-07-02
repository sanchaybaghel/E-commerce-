import React from 'react';
import { Link } from 'react-router-dom';
import { XCircleIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

function CancelPage() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <XCircleIcon className="h-16 w-16 text-warning-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Payment Cancelled</h1>
        <p className="text-secondary-600 mb-8">
          Your payment was not completed. Don't worry, no charges were made to your account.
        </p>

        <div className="space-y-4">
          <Link
            to="/cart"
            className="btn-primary w-full flex items-center justify-center"
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Return to Cart
          </Link>
          <Link
            to="/"
            className="btn-secondary w-full flex items-center justify-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <p className="text-sm text-secondary-500 mt-6">
          Need help? <Link to="/contact" className="text-primary-600 hover:text-primary-700">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}

export default CancelPage;