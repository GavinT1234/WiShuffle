import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reloadError, setReloadError] = useState("");

  const attemptedRef = useRef(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    attemptedRef.current = true;
    await login({ email, password });
  };

  // Runs whenever `error` changes after a login attempt
  useEffect(() => {
    if (attemptedRef.current && error) {
      sessionStorage.setItem("loginError", error);
      window.location.reload();
    }
  }, [error]);

  useEffect(() => {
    clearError();

    const stored = sessionStorage.getItem("loginError");
    if (stored) {
      setReloadError(stored);
      sessionStorage.removeItem("loginError");
    }
  }, []);

  const displayError = reloadError || error;

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {displayError && (
            <p className="text-red-500 text-sm mt-2">{displayError}</p>
          )}
          <button className="btn btn-neutral mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default LoginPage;