import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    clearError();
  }, []);
  return (
    <div className="flex flex-col justify-center place-items-center h-full overflow-hidden">
      <form onSubmit={handleLogin}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? error : ""}
          <button className="btn btn-neutral mt-4" disable={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default LoginPage;
