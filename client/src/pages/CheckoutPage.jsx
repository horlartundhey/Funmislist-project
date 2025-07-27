import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate, Link, useLocation } from 'react-router-dom';
import { initiatePayment, resetPayment } from '../slices/paymentSlice';
import { clearCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import formatCurrency from '../utils/formatCurrency';


function isValidPhoneNumber(phone) {
  // Nigerian phone number: 11 digits, starts with 0, or general 10/11 digits
  return /^0\d{10}$/.test(phone);
}

function CheckoutPage() {
  const { userInfo, token } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const payment = useSelector((state) => state.payment);
  const [form, setForm] = useState({ address: '', city: '', phone: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [phoneError, setPhoneError] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'phone') {
      if (!isValidPhoneNumber(e.target.value)) {
        setPhoneError('Enter a valid 11-digit phone number starting with 0');
      } else {
        setPhoneError('');
      }
    }
  };

  useEffect(() => {
    // Reset payment state when component mounts
    dispatch(resetPayment());
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Decrement stock and clear cart on successful payment before redirect
    if (payment.success && payment.authorizationUrl) {
      // Decrement stock for each item
      cartItems.forEach(async (item) => {
        await fetch(`https://funmislist-project.vercel.app/api/products/${item.id}/adjust-stock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: item.quantity })
        });
      });
      dispatch(clearCart());
      // Redirect to Paystack
      window.location.href = payment.authorizationUrl;
    }
  }, [payment.success, payment.authorizationUrl, cartItems, dispatch, token]);

  useEffect(() => {
    // Show error message if payment initiation fails
    if (payment.error) {
      toast.error(payment.error);
    }
  }, [payment.error]);

  const handlePayNow = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.address || !form.city || !form.phone) {
      toast.error('Please fill in all shipping details');
      return;
    }
    if (!isValidPhoneNumber(form.phone)) {
      setPhoneError('Enter a valid 11-digit phone number starting with 0');
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate cart
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Initialize payment
    dispatch(initiatePayment({
      userEmail: userInfo.email,
      total: totalPrice,
      itemType: 'product',
      itemId: cartItems[0]?.id,
      // You could also send shipping details if needed
      shippingDetails: form
    }));
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Checkout</h1>
          <div className="bg-yellow-900/50 border border-yellow-600/50 text-yellow-200 p-4 rounded-lg mb-4">
            You need to <Link to="/login" className="text-blue-400 underline hover:text-blue-300">login</Link> to complete this transaction.<br />
            Don't have an account? <Link to={`/register?returnTo=${encodeURIComponent(location.pathname)}`} className="text-blue-400 underline hover:text-blue-300">Register here</Link>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Checkout
        </h1>
        
        {/* Order Summary */}
        <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-400">Your cart is empty.</p>
          ) : (
            <>
              <ul className="mb-4 divide-y divide-gray-700">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between py-3 text-gray-300">
                    <div className="flex items-center">
                      <span>{item.name}</span>
                      <span className="mx-2 text-gray-500">×</span>
                      <span className="text-gray-400">{item.quantity}</span>
                    </div>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between pt-4 border-t border-gray-700 text-lg font-semibold text-gray-100">
                <span>Total</span>
                <span className="text-blue-400">{formatCurrency(totalPrice)}</span>
              </div>
            </>
          )}
        </div>

        {/* Shipping Form */}
        <form onSubmit={handlePayNow} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Shipping Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your shipping address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
              {phoneError && (
                <p className="text-red-400 text-xs mt-1">{phoneError}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={cartItems.length === 0 || payment.loading}
            className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {payment.loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay Now (${formatCurrency(totalPrice)})`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;