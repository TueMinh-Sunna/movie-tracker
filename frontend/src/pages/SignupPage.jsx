import useDocumentTitle from "../hooks/useDocumentTitle";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { validateSignupForm } from "../utils/validation";
import styles from "./AuthPage.module.css";

export default function SignupPage() {
  useDocumentTitle("Sign up");

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className={styles.root}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign up</h1>
          <p className={styles.description}>
            Create an account to save anime, rate titles, and join comments.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="signup-username" className={styles.label}>
              Username
            </label>

            <input
              id="signup-username"
              type="text"
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFieldErrors((current) => ({ ...current, username: "" }));
              }}
              className={styles.input}
            />

            {fieldErrors.username ? (
              <div className={styles.fieldError}>{fieldErrors.username}</div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-email" className={styles.label}>
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((current) => ({ ...current, email: "" }));
              }}
              className={styles.input}
            />

            {fieldErrors.email ? (
              <div className={styles.fieldError}>{fieldErrors.email}</div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-password" className={styles.label}>
              Password
            </label>

            <div className={styles.inputWrapper}>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((current) => ({
                    ...current,
                    password: "",
                    confirmPassword: "",
                  }));
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

          <div className={styles.field}>
            <label htmlFor="signup-confirm-password" className={styles.label}>
              Confirm password
            </label>

            <div className={styles.inputWrapper}>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((current) => ({
                    ...current,
                    confirmPassword: "",
                  }));
                }}
                className={`${styles.input} ${styles.inputWithIcon}`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={styles.iconButton}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {fieldErrors.confirmPassword ? (
              <div className={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </div>
            ) : null}
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Go to Login
          </Link>
        </p>
      </section>
    </div>
  );
}