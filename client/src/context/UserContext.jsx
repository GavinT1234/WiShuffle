import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../api/user";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    getUser()
      .then(setUser)
      .catch(() => localStorage.removeItem("token")) // bad/expired token
      .finally(() => setLoading(false));
  }, []); // runs once on app mount

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);