import styles from "./EmptyState.module.css";

export default function EmptyState({
  title = "Nothing here yet",
  message = "Nothing found.",
  compact = false,
}) {
  return (
    <div className={`${styles.root} ${compact ? styles.compact : ""}`}>
      <div className={styles.icon} aria-hidden="true">
        ☆
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}