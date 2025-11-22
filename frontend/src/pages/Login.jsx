import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../pages/Styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/login", { email, password });

    // FIXED
    localStorage.setItem("hrms_token", res.data.token);

    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
}


  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>HRMS Login</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-text">
          No account? <Link to="/register">Create Organisation</Link>
        </p>
      </div>
    </div>
  );
}
