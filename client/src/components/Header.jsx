import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { fetchCategories } from '../slices/categorySlice';
import { logout } from '../slices/userSlice';
import logobg from '../assets/Funmislistbgn.png'


function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const cartCount = useSelector((state) => state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0));
  const { categories } = useSelector((state) => state.categories);
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
          <img src={logobg} alt='funmislist logo' style={{width:'100px', borderRadius:'10px'}} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-8 items-center">
          <Link to="/shop" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Shop</Link>
          <Link to="/properties" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Properties</Link>
          {/* Category dropdowns */}
          <div className="relative group">
            <button className={`transition flex items-center gap-1 ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>
              Categories <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 ease-in-out z-50">
              {categories && categories.length > 0 ? (
                <ul className="py-2">
                  {categories.map((cat) => (
                    <li key={cat._id} className="relative group/item">
                      <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 hover:bg-gray-100 font-semibold">
                        {cat.name}
                      </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="absolute left-full top-0 w-48 bg-white rounded-lg shadow-xl 
                          opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible 
                          transition-all duration-300 ease-in-out -ml-2">
                          <ul className="py-2">
                            {cat.subcategories.map((sub, idx) => (
                              <li key={idx}>
                                <Link 
                                  to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}/subcategory/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-gray-400">No categories</div>
              )}
            </div>
          </div>
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
            {/* Mobile categories with subcategories */}
            <div>
              <span className="block text-gray-800 font-semibold mb-1">Categories</span>
              {categories && categories.length > 0 ? (
                <ul>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-2 py-1 hover:bg-gray-100 rounded">
                        {cat.name}
                      </Link>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <ul className="pl-4">
                          {cat.subcategories.map((sub, idx) => (
                            <li key={idx}>
                              <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => setMobileOpen(false)}
                                className="block px-2 py-1 text-sm hover:bg-gray-200 rounded">
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-2 py-1 text-gray-400">No categories</div>
              )}
            </div>
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