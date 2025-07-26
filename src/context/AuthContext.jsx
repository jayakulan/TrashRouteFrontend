import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie, deleteCookie, setCookieObject, getCookieObject } from '../utils/cookieUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in cookies on app startup
    const token = getCookie('token');
    const storedUser = getCookieObject('user');
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        const { user: userData, token, profile } = result.data;
        setCookie('token', token, 7); // 7 days expiration
        setCookieObject('user', userData, 7);
        setUser(userData);

        // Store company_id and full company profile for company users
        if (userData.role === "company" && profile && profile.company_id) {
          setCookie('company_id', profile.company_id, 7);
          setCookieObject('company_profile', profile, 7);
        }

        // Store customer_id and full customer profile for customer users
        if (userData.role === "customer" && profile && profile.customer_id) {
          setCookie('customer_id', profile.customer_id, 7);
          setCookieObject('customer_profile', profile, 7);
        }

        // Navigate based on role
        switch (userData.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "company":
            navigate("/company-waste-prefer");
            break;
          case "customer":
            navigate("/customer/trash-type");
            break;
          default:
            throw new Error("Unknown user role");
        }
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear server-side sessions
      const token = getCookie('token');
      if (token) {
        await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/auth/logout.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        });
      }
    } catch (error) {
      console.log("Backend logout failed, continuing with frontend cleanup");
    }
    
    // Clear all cookies
    deleteCookie('token');
    deleteCookie('user');
    deleteCookie('company_id');
    deleteCookie('company_profile');
    deleteCookie('customer_id');
    deleteCookie('customer_profile');
    
    // Clear user state
    setUser(null);
    
    // Clear browser cache and storage
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear browser cache for the domain
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Force reload to clear any cached pages
      window.location.href = '/';
    } else {
      navigate('/');
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    setCookieObject('user', updatedUserData, 7);
  };

  const getAuthHeaders = () => {
    const token = getCookie('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const getCustomerId = () => {
    return getCookie('customer_id');
  };

  const getCompanyId = () => {
    return getCookie('company_id');
  };

  const getCustomerProfile = () => {
    return getCookieObject('customer_profile');
  };

  const getCompanyProfile = () => {
    return getCookieObject('company_profile');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      getAuthHeaders, 
      getCustomerId, 
      getCompanyId, 
      getCustomerProfile, 
      getCompanyProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 