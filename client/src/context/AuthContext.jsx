import { createContext, useContext, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../lib/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi({ email, password });
      const token = response.accessToken.accessToken;
      localStorage.setItem("token", token);

      // ⚡ Create/connect socket AFTER token exists
      const socket = getSocket(token);
      if (!socket.connected) {
        socket.connect();
      }

      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      localStorage.removeItem("token");
      const token = localStorage.getItem("token");
      const socket = getSocket(token);
      if (socket) socket.disconnect();
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await registerApi({ username, email, password });
      await login({ email, password }); // reuse login logic
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
      <AuthContext.Provider
          value={{
            isLoggedIn,
            loading,
            error,
            login,
            logout,
            register,
            clearError,
            authHeader,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);