import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaBars, FaChevronDown, FaChevronCircleRight } from 'react-icons/fa';
import { fetchCategories } from '../slices/categorySlice';
import { logout } from '../slices/userSlice';
import logobg from '../assets/Funmislistbgn.png'


function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);  const cartCount = useSelector((state) => state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { filteredCategories: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-');

  return (
    <header className={`${isHome ? 'absolute inset-x-0 top-0 z-30 text-white' : 'fixed w-full top-0 z-30 bg-white shadow-md text-gray-800'}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`text-2xl font-bold transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>
          <img src={logobg} alt='funmislist logo' style={{width:'100px', borderRadius:'10px'}} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-8">
          <Link to="/shop" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Shop</Link>
          <Link to="/properties" className={`transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Properties</Link>          <div className="relative group">
            <button className={`flex items-center transition ${isHome ? 'text-white hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}>Categories
              <FaChevronDown className="ml-1 text-sm" />
            </button>
            {/* Invisible bridge to prevent gap between button and dropdown */}
            <div className="absolute h-2 w-full -bottom-2"></div>
            <div className="absolute left-0 top-full w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-500 ease-in-out z-10 pointer-events-none group-hover:pointer-events-auto hover:pointer-events-auto">               {categories.map(cat => (                <div key={cat._id} className="relative group/item border-b last:border-none">
                   <Link to={`/category/${slugify(cat.name)}`} className="block px-4 py-2 font-medium text-gray-800 hover:bg-gray-50">{cat.name}
                     {cat.subcategories?.length > 0 && (
                       <FaChevronCircleRight className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                     )}
                   </Link>
                   {cat.subcategories?.length > 0 && (
                     <div className="absolute left-full top-0 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200">
                       {cat.subcategories.map((sub, idx) => (
                         <Link key={idx} to={`/category/${slugify(cat.name)}/${slugify(sub.name)}`} 
                           className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">{sub.name}</Link>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
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
            <div className="mb-2">
              <span className="font-medium">Categories</span>
              <div className="mt-1 space-y-1">
                {categories.map(cat => (
                  <div key={cat._id} className="pl-2">
                    <Link to={`/category/${slugify(cat.name)}`} onClick={() => setMobileOpen(false)} className="block text-gray-800 hover:text-red-500">{cat.name}</Link>
                    {cat.subcategories?.map((sub, idx) => (
                      <Link key={idx} to={`/category/${slugify(cat.name)}/${slugify(sub.name)}`} onClick={() => setMobileOpen(false)} className="block pl-4 text-gray-600 hover:text-red-500">{sub.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
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
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="relative text-gray-800 hover:text-red-500">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-300 text-black text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;