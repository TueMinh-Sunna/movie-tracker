import { Link } from "react-router-dom";
import RatingBadge from "./RatingBadge";
import styles from "./AnimeCard.module.css";

export default function AnimeCard({
  anime,
  actions = null,
  subtitle = null,
}) {
  return (
    <article className={styles.root}>
      <Link to={`/anime/${anime.id}`} className={styles.mediaLink}>
        <div className={styles.posterWrap}>
          <img
            src={anime.imageUrl}
            alt={anime.title}
            className={styles.poster}
          />

          <div className={styles.posterShade} />
        </div>
      </Link>

      <div className={styles.body}>
        <Link to={`/anime/${anime.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{anime.title}</h3>
        </Link>

        <div className={styles.metaRow}>
          <RatingBadge
            label="Global"
            value={anime.averageRating}
            compact
            emptyText="No rating"
          />
        </div>

        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </article>
  );
}