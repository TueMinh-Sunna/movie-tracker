import styles from "./RatingBadge.module.css";

export default function RatingBadge({
  value,
  label = "Rating",
  personal = false,
  compact = false,
  precision = 1,
  emptyText = "No rating",
}) {
  const numericValue = Number(value);
  const hasRating = Number.isFinite(numericValue) && numericValue > 0;

  return (
    <div
      className={styles.root}
      data-personal={personal ? "true" : "false"}
      data-compact={compact ? "true" : "false"}
    >
      <span className={styles.label}>{label}</span>

      <span className={styles.score}>
        <span className={styles.star} aria-hidden="true">
          {hasRating ? "★" : "☆"}
        </span>

        {hasRating ? (
          <>
            <span>{numericValue.toFixed(precision)}</span>
            <span className={styles.outOf}>/10</span>
          </>
        ) : (
          <span className={styles.empty}>{emptyText}</span>
        )}
      </span>
    </div>
  );
}