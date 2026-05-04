import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.root}>
      <label htmlFor="browse-search" className={styles.label}>
        Search
      </label>

      <input
        id="browse-search"
        type="text"
        placeholder="Search by title..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
      />
    </div>
  );
}