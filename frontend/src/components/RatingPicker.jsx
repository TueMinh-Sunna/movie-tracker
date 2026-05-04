import styles from "./RatingPicker.module.css";

const RATING_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function RatingPicker({
  value,
  onChange,
  disabled = false,
  compact = false,
  ariaLabel = "Choose personal rating",
}) {
  const selectedValue = Number(value);

  return (
    <div className={styles.root} data-compact={compact ? "true" : "false"}>
      <div className={styles.scale} role="radiogroup" aria-label={ariaLabel}>
        {RATING_VALUES.map((rating) => {
          const isSelected = selectedValue === rating;

          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(String(rating))}
              disabled={disabled}
              className={styles.ratingButton}
              data-selected={isSelected ? "true" : "false"}
            >
              {rating}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange("")}
        disabled={disabled || !value}
        className={styles.clearButton}
      >
        Clear rating
      </button>
    </div>
  );
}