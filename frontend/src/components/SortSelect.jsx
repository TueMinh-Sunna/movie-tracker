import styles from "./SortSelect.module.css";

export default function SortSelect({ value, onChange }) {
  return (
    <div className={styles.root}>
      <label htmlFor="browse-sort" className={styles.label}>
        Sort by
      </label>

      <select
        id="browse-sort"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.select}
      >
        <option value="rating_desc">Rating: High to Low</option>
        <option value="rating_asc">Rating: Low to High</option>
        <option value="title_asc">Title: A to Z</option>
        <option value="title_desc">Title: Z to A</option>
      </select>
    </div>
  );
}