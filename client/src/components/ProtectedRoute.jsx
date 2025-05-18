import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login with return URL
    return <Navigate 
      to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} 
      replace 
    />;
  }

  // Check role-based access
  if (adminOnly && userInfo.role !== 'admin') {
    // If admin route but user is not admin, redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && userInfo.role === 'admin') {
    // If user route but user is admin, redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
