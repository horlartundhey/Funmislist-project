import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api.js';

function EmailVerificationPage() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const hasVerified = useRef(false); // Prevent duplicate requests

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent duplicate verification attempts
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Email verification failed');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    if (token && !hasVerified.current) {
      verifyEmail();
    } else if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-200 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-400">
              Please wait while we verify your email address.
            </p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-200 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-400 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              Continue to Login
            </Link>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <FaTimesCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-200 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
              >
                Go to Login
              </Link>
              <ResendVerificationButton />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        {renderContent()}
      </div>
    </div>
  );
}

// Component for resending verification email
function ResendVerificationButton() {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      
      if (response.ok) {
        setShowEmailInput(false);
        setEmail('');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showEmailInput) {
    return (
      <div>
        <button
          onClick={() => setShowEmailInput(true)}
          className="text-sm text-blue-400 hover:text-blue-300 underline"
        >
          Resend verification email
        </button>
        {message && (
          <p className="mt-2 text-sm text-gray-400">{message}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleResend} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button
          type="button"
          onClick={() => setShowEmailInput(false)}
          className="flex-1 px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
      {message && (
        <p className="text-sm text-gray-400">{message}</p>
      )}
    </form>
  );
}

export default EmailVerificationPage;
