import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCookie } from '../utils/cookieUtils';

const URLProtection = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDirectAccess = () => {
      const token = getCookie('token');
      const user = getCookie('user');

      // If no authentication, redirect to login
      if (!token || !user) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Authentication required'
          }
        });
        return;
      }

      // Check referrer to detect direct URL access
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;
      
      // Define allowed referrers
      const allowedReferrers = [
        currentOrigin + '/login',
        currentOrigin + '/signup',
        currentOrigin + '/company-signup',
        currentOrigin + '/',
        '', // No referrer (first visit)
        currentOrigin // Same origin navigation
      ];

      // Check if referrer is allowed
      const isAllowedReferrer = allowedReferrers.some(allowed => 
        referrer.startsWith(allowed)
      );

      // Additional check: Verify if this is a legitimate navigation
      const isInternalNavigation = referrer.startsWith(currentOrigin);
      const isFromAuthPage = referrer.includes('/login') || 
                           referrer.includes('/signup') || 
                           referrer.includes('/company-signup');
      const isFirstVisit = !referrer || referrer === '';
      const isBookmarkOrDirect = !referrer || referrer === '';

      // Allow access if it's a legitimate navigation
      if (isInternalNavigation || isFromAuthPage || isFirstVisit || isBookmarkOrDirect) {
        // Additional verification: Check with backend
        verifyWithBackend();
      } else {
        // This is likely a direct URL access from external source
        console.log('Direct URL access detected from:', referrer);
        console.log('Current location:', location.pathname);
        
        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();
        
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Direct access not allowed. Please log in again.'
          }
        });
      }
    };

    const verifyWithBackend = async () => {
      try {
        const token = getCookie('token');
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/auth/check_session.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          setIsValidAccess(true);
          setIsChecking(false);
        } else {
          // Session is invalid, redirect to login
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: result.message || 'Session expired. Please log in again.'
            }
          });
        }
      } catch (error) {
        console.error('Backend verification failed:', error);
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Authentication failed. Please log in again.'
          }
        });
      }
    };

    checkDirectAccess();
  }, [location, navigate]);

  // Show loading while checking
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

  return children;
};

export default URLProtection; 