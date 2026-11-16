import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { login } from "../../services/authService";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (localStorage.getItem("aqua_admin_token"))
    return <Navigate to="/admin" replace />;
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn’t sign you in. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-login">
      <Link
        className="back-home"
        to="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <ArrowLeft size={15} /> Back to Verma Enterprises
      </Link>
      <div className="login-card">
        <img className="admin-login-logo" src="/images/verma-enterprises-logo.webp" alt="Verma Enterprises" />
        <span className="eyebrow">THE BACK OFFICE</span>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <p>A quiet place to take care of the little details.</p>
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vermaenterprises.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-dark login-submit" disabled={busy}>
            <LockKeyhole size={15} />
            {busy ? "Signing in…" : "Sign in to your shop"}
          </button>
        </form>
        <span className="login-footnote">
          VERMA ENTERPRISES · SECURE ADMIN SIGN IN
        </span>
      </div>
    </main>
  );
}
