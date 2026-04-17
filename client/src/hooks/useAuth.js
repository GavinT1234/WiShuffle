import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginRequest } from "../api/auth";

export const useAuth = () => {
  const { login, logout } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest({ email, password });
      login(response.accessToken.accessToken, response.accessToken.user);      // store token + set user in context
      navigate("/dashboard");
    } catch (err) {
      setError(err.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return { handleLogin, handleLogout, error, loading };
};