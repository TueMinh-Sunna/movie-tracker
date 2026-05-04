import styles from "./WatchStatusSelect.module.css";

export default function WatchStatusSelect({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={styles.select}
    >
      <option value="WATCH_LATER">Watch later</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}