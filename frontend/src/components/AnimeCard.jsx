import { Link } from "react-router-dom";
import styles from "./AnimeCard.module.css";

export default function AnimeCard({
  anime,
  actions = null,
  subtitle = null,
}) {
  const hasRating = anime.averageRating > 0;

  return (
    <article className={styles.root}>
      <Link to={`/anime/${anime.id}`} className={styles.mediaLink}>
        <div className={styles.posterWrap}>
          <img
            src={anime.imageUrl}
            alt={anime.title}
            className={styles.poster}
          />
        </div>
      </Link>

      <Link to={`/anime/${anime.id}`} className={styles.contentLink}>
        <div className={styles.content}>
          <h3 className={styles.title}>{anime.title}</h3>

          <div className={styles.ratingRow}>
            <span className={styles.ratingLabel}>Global rating</span>
            <span
              className={`${styles.ratingValue} ${
                !hasRating ? styles.ratingValueEmpty : ""
              }`}
            >
              {hasRating ? anime.averageRating.toFixed(1) : "No ratings yet"}
            </span>
          </div>

          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>
      </Link>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </article>
  );
}