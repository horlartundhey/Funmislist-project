import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccessPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);

  useEffect(() => {
    const reference = query.get('reference');
    const itemType = query.get('itemType');
    const itemId = query.get('itemId');
    if (!reference || !itemType || !itemId) {
      setError('Missing payment reference, item type, or item ID.');
      setStatus('error');
      return;
    }
    // Call backend to verify payment for either product or property
    fetch(`${API_BASE_URL}/payments/verify?reference=${reference}&itemType=${itemType}&itemId=${itemId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setStatus('success');
        } else {
          setError(data.message || 'Payment verification failed.');
          setStatus('error');
        }
      })
      .catch((err) => {
        setError(err.message || 'Payment verification failed.');
        setStatus('error');
      });
  }, [query, token]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      {status === 'verifying' && <p>Verifying your payment...</p>}
      {status === 'success' && (
        <>
          <p className="text-green-600 font-semibold">Payment verified and order recorded successfully!</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="text-red-600 font-semibold">{error}</p>
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => navigate('/')}>Go Home</button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
