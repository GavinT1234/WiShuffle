import React from "react";
import { useAuth } from "../context/AuthContext";
const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button className="btn border hover:border-white" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;
