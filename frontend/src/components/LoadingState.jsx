import styles from "./LoadingState.module.css";

export default function LoadingState({
  message = "Loading...",
  compact = false,
}) {
  return (
    <div
      className={`${styles.root} ${compact ? styles.inline : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}