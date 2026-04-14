import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { authState } from "../state/authState";
import { validateLoginForm } from "../utils/validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const nextFieldErrors = validateLoginForm({
      usernameOrEmail,
      password,
    });

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const user = await loginUser({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      setAuth({
        user,
        isLoading: false,
      });

      navigate("/browse");
    } catch (err) {
      setError(err.message || "Login failed.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Username or email
          </label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
              setFieldErrors((current) => ({
                ...current,
                usernameOrEmail: "",
              }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.usernameOrEmail && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.usernameOrEmail}
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
              setFieldErrors((current) => ({ ...current, password: "" }));
            }}
            style={{ width: "100%", padding: "10px" }}
          />
          {fieldErrors.password && (
            <p style={{ color: "crimson", margin: "6px 0 0" }}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        {error && (
          <p style={{ color: "crimson", marginBottom: "12px" }}>{error}</p>
        )}

        <button type="submit" disabled={submitting} style={{ padding: "10px 16px" }}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        No account yet? <Link to="/signup">Go to Sign up</Link>
      </p>
    </div>
  );
}