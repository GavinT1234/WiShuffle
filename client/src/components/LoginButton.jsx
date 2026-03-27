import React from "react";
import { useNavigate } from "react-router-dom";
const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="btn border hover:border-white"
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  );
};

export default LoginButton;
