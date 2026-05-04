import styles from "./WatchLaterButton.module.css";

export default function WatchLaterButton({
  isSaved = false,
  isLoading = false,
  disabled = false,
  onClick,
  variant = "default",
  defaultLabel = "Watch later",
  savedLabel = "Saved",
  loadingLabel = "Saving...",
}) {
  const label = isLoading ? loadingLabel : isSaved ? savedLabel : defaultLabel;
  const icon = isLoading ? "…" : isSaved ? "✓" : "+";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading || isSaved}
      aria-pressed={isSaved}
      data-saved={isSaved ? "true" : "false"}
      data-variant={variant}
      className={styles.root}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}