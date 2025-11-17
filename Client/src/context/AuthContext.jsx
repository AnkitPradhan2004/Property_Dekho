import { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success('Login successful!');
        return res.data;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await authAPI.signup(name, email, password);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success('Account created successfully!');
        return res.data;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success('Logged out successfully');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await authAPI.getMe();
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only remove token if it's an auth error, not a network error
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
        }
        // Don't show error toast on initial load if server is down
        if (error.code !== 'ECONNREFUSED' && error.code !== 'ERR_NETWORK') {
          console.warn('Authentication check failed, but keeping token for retry');
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
