import styles from "./RatingInput.module.css";

export default function RatingInput({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <input
      type="number"
      min="1"
      max="10"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder="1 to 10"
      className={styles.input}
    />
  );
}