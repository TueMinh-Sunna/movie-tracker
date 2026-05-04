import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeList } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import EmptyState from "../components/EmptyState";
import { authState } from "../state/authState";
import styles from "./HomePage.module.css";
import { AnimeGridSkeleton } from "../components/Skeleton";


export default function HomePage() {
  useDocumentTitle("Home");

  const auth = useRecoilValue(authState);

  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopAnime() {
      setLoading(true);
      setError("");

      try {
        const result = await getAnimeList({ sort: "rating_desc" });
        setTopAnime(result.slice(0, 6));
      } catch (err) {
        setError(err.message || "Failed to load top anime.");
      } finally {
        setLoading(false);
      }
    }

    loadTopAnime();
  }, []);

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Track what you love</span>

          <div>
            <h1 className={styles.title}>Mini Anime List</h1>
            <p className={styles.description}>
              Browse anime, explore details, read comments, and manage your own
              watchlist with personal ratings and watch status.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link to="/browse" className={styles.primaryAction}>
              Browse anime
            </Link>

            {auth.user ? (
              <Link to="/watchlist" className={styles.secondaryAction}>
                Go to my watchlist
              </Link>
            ) : (
              <>
                <Link to="/signup" className={styles.secondaryAction}>
                  Create account
                </Link>
                <Link to="/login" className={styles.ghostAction}>
                  Log in
                </Link>
              </>
            )}
          </div>

          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>Search and filter anime</span>
            <span className={styles.metaItem}>Read and post comments</span>
            <span className={styles.metaItem}>Build your personal watchlist</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>Top rated anime</h2>
            <p className={styles.sectionDescription}>
              A quick look at the highest-rated titles in the app right now.
            </p>
          </div>

          <Link to="/browse" className={styles.viewAllLink}>
            View all anime
          </Link>
        </div>

        {loading && <AnimeGridSkeleton count={6} />}

        {error && <div className={styles.errorBox}>Error: {error}</div>}

        {!loading && !error && topAnime.length === 0 && (
          <EmptyState
            title="No anime yet"
            message="No anime available right now."
          />
        )}

        {!loading && !error && topAnime.length > 0 && (
          <div className={styles.grid}>
            {topAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}