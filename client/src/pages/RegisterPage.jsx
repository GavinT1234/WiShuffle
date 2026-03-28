import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
const RegisterPage = () => {
  const { loading, error, register, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ username, email, password });
  };

  useEffect(() => {
    clearError();
  }, []);

  return (
    <div className="flex flex-col justify-center place-items-center h-full overflow-hidden">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register</legend>
          <label className="label">Name</label>
          <input
            type="name"
            className="input"
            placeholder="name"
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default RegisterPage;
