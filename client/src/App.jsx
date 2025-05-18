import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ShopPage from './pages/ShopPage';
import PropertyPage from './pages/PropertyPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import IconsOverlay from './components/home/IconsOverlay';
import './App.css';

// Layout component runs inside Router so useLocation works
function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <IconsOverlay />} 
      {!isAdmin && <Header />}
      <main className={`flex-grow ${!isHome && !isAdmin ? 'pt-16' : ''}`}> {/* space for fixed header on subpages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userOnly>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/properties" element={<PropertyPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
