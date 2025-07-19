import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage on app startup
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
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
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Store company_id and full company profile for company users
        if (userData.role === "company" && profile && profile.company_id) {
          localStorage.setItem('company_id', profile.company_id);
          localStorage.setItem('company_profile', JSON.stringify(profile));
        }

        // Store customer_id for customer users
        if (userData.role === "customer" && profile && profile.customer_id) {
          localStorage.setItem('customer_id', profile.customer_id);
          localStorage.setItem('customer_profile', JSON.stringify(profile));
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, getAuthHeaders }}>
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