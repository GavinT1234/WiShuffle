import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="btn border hover:border-white"
      onClick={() => navigate("/register")}
    >
      Register
    </button>
  );
};

export default RegisterButton;
