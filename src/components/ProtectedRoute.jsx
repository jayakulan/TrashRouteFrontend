import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCookie } from '../utils/cookieUtils';
import NoCache from './NoCache';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValidAccess, setIsValidAccess] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('token');
      const storedUser = getCookie('user');

      // If no token or user, redirect to login
      if (!token || !storedUser) {
        // Clear any remaining data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login with return URL
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Please log in to access this page'
          }
        });
        return;
      }

      // If role is required, check user role
      if (requiredRole && user?.role !== requiredRole) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: `Access denied. ${requiredRole} role required.`
          }
        });
        return;
      }

      // Additional security: Check if this is a direct URL access
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      
      // Allow access if:
      // 1. Coming from same origin (internal navigation)
      // 2. Coming from login page
      // 3. Coming from signup page
      // 4. No referrer (first visit or bookmark)
      const isInternalNavigation = referrer.startsWith(currentOrigin);
      const isFromLogin = referrer.includes('/login');
      const isFromSignup = referrer.includes('/signup') || referrer.includes('/company-signup');
      const isFirstVisit = !referrer || referrer === '';
      
      if (!isInternalNavigation && !isFromLogin && !isFromSignup && !isFirstVisit) {
        // This is likely a direct URL access from external source
        console.log('Direct URL access detected, redirecting to login');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Direct access not allowed. Please log in again.'
          }
        });
        return;
      }

      // Additional check: Verify token with backend
      const verifyTokenWithBackend = async () => {
        try {
          const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/auth/check_session.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const result = await response.json();
          
          if (!result.success) {
            // Token is invalid, redirect to login
            navigate('/login', { 
              state: { 
                from: location.pathname,
                message: 'Session expired. Please log in again.'
              }
            });
            return;
          }
          
          setIsValidAccess(true);
          setIsChecking(false);
        } catch (error) {
          console.error('Token verification failed:', error);
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: 'Authentication failed. Please log in again.'
            }
          });
        }
      };

      verifyTokenWithBackend();
    };

    checkAuth();
  }, [user, requiredRole, navigate, location]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Only render children if access is valid
  if (!isValidAccess) {
    return null;
  }

  return (
    <>
      <NoCache />
      {children}
    </>
  );
};

export default ProtectedRoute; 