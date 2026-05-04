import useDocumentTitle from "../hooks/useDocumentTitle";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { authState } from "../state/authState";
import { validateLoginForm } from "../utils/validation";
import styles from "./AuthPage.module.css";

export default function LoginPage() {
  useDocumentTitle("Login");

  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className={styles.root}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.description}>
            Welcome back. Log in to manage your watchlist and comments.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="login-username" className={styles.label}>
              Username or email
            </label>

            <input
              id="login-username"
              type="text"
              autoFocus
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  usernameOrEmail: "",
                }));
              }}
              className={styles.input}
            />

            {fieldErrors.usernameOrEmail ? (
              <div className={styles.fieldError}>
                {fieldErrors.usernameOrEmail}
              </div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>

            <div className={styles.inputWrapper}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((current) => ({ ...current, password: "" }));
                }}
                className={`${styles.input} ${styles.inputWithIcon}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.iconButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {fieldErrors.password ? (
              <div className={styles.fieldError}>{fieldErrors.password}</div>
            ) : null}
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.footer}>
          No account yet?{" "}
          <Link to="/signup" className={styles.link}>
            Go to Sign up
          </Link>
        </p>
      </section>
    </div>
  );
}