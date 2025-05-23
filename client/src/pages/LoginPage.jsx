import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      console.log('Logged in user info:', userInfo);
      const returnUrl = new URLSearchParams(window.location.search).get('returnTo');
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        if (userInfo.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [userInfo, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch('https://funmislist-project.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API response:', data);
      if (response.ok) {
        // Pass the entire data object to login action
        dispatch(login({ 
          userInfo: data,
          token: data.token 
        }));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please sign in to your account
          </p>
        </div>
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;