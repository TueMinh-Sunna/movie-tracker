import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { validateSignupForm } from "../utils/validation";

export default function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const nextFieldErrors = validateSignupForm({
      username,
      email,
      password,
      confirmPassword,
    });

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <h1>Sign up</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setFieldErrors((current) => ({ ...current, username: "" }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.username && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.username}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((current) => ({ ...current, email: "" }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.email && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((current) => ({
                ...current,
                password: "",
                confirmPassword: "",
              }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.password && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((current) => ({
                ...current,
                confirmPassword: "",
              }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.confirmPassword && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {error && (
          <p style={{ color: "crimson", marginBottom: "12px" }}>{error}</p>
        )}

        <button type="submit" disabled={submitting} style={{ padding: "10px 16px" }}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
}