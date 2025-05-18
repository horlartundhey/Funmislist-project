import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { fetchCategories } from '../slices/categorySlice';
import { logout } from '../slices/userSlice';

function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const cartCount = useSelector((state) => state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <header className={`${isHome ? 'absolute inset-x-0 top-0 z-30 text-white' : 'fixed w-full top-0 z-30 bg-white shadow-md text-gray-800'}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`text-2xl font-bold transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>
          Funmislist
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-8">
          <Link to="/shop" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Shop</Link>
          <Link to="/properties" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Properties</Link>
          <Link to="/category" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Categories</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          { userInfo ? (
            <>
              <Link to="/dashboard" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>{userInfo.name}</Link>
              <button onClick={() => dispatch(logout())} className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Login</Link>
              <Link to="/register" className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition">Sign Up</Link>
            </>
          )}
          <Link to="/cart" className={`relative transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-300 text-black text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden transition ${isHome ? 'text-white' : 'text-gray-800'}`}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white bg-opacity-95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="text-gray-800 hover:text-red-500">Shop</Link>
            <Link to="/properties" onClick={() => setMobileOpen(false)} className="text-gray-800 hover:text-red-500">Properties</Link>
            <Link to="/category" onClick={() => setMobileOpen(false)} className="text-gray-800 hover:text-red-500">Categories</Link>
            { userInfo ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-gray-800 hover:text-red-500">{userInfo.name}</Link>
                <button onClick={() => { dispatch(logout()); setMobileOpen(false); }} className="text-gray-800 hover:text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-800 hover:text-red-500">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-center">Sign Up</Link>
              </>
            )}
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center text-gray-800 hover:text-red-500">
              Cart ({cartCount})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;