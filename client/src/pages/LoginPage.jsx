import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, error, loading } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
};

export default LoginPage;