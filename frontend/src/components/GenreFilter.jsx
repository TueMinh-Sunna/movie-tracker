import styles from "./GenreFilter.module.css";

export default function GenreFilter({ genres, value, onChange }) {
  return (
    <div className={styles.root}>
      <label htmlFor="browse-genre" className={styles.label}>
        Genre
      </label>

      <select
        id="browse-genre"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.select}
      >
        <option value="">All genres</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}