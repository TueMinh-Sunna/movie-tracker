import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeList } from "../api/animeApi";
import RatingBadge from "../components/RatingBadge";
import EmptyState from "../components/EmptyState";
import { authState } from "../state/authState";
import styles from "./HomePage.module.css";
import { AnimeGridSkeleton } from "../components/Skeleton";

export default function HomePage() {
  useDocumentTitle("Home");

  const auth = useRecoilValue(authState);

  const [topAnime, setTopAnime] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAutoPaused, setIsAutoPaused] = useState(false);

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

  useEffect(() => {
    if (isAutoPaused || topAnime.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= topAnime.length) {
          return 0;
        }

        return nextIndex;
      });
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoPaused, topAnime.length]);

  const featuredAnime = topAnime[featuredIndex] ?? topAnime[0];
  const sideAnime = topAnime.filter((_, index) => index !== featuredIndex);

  function handleSelectFeatured(index) {
    setFeaturedIndex(index);
    setIsAutoPaused(true);
  }

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Track what you love</span>

          <div>
            <h1 className={styles.title}>Mini Anime List</h1>
            <p className={styles.description}>
              Browse anime, save titles to Watch later, rate your favorites,
              and build a personal anime playlist.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link to="/browse" className={styles.primaryAction}>
              Browse anime
            </Link>

            {auth.user ? (
              <Link to="/watchlist" className={styles.secondaryAction}>
                Open Watch later
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
            <span className={styles.metaItem}>Save anime</span>
            <span className={styles.metaItem}>Rate from 1 to 10</span>
            <span className={styles.metaItem}>Track watch status</span>
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <span className={styles.sectionEyebrow}>Top rated</span>
            <h2 className={styles.sectionTitle}>Featured anime</h2>
            <p className={styles.sectionDescription}>
              The highest-rated titles in your app, presented like a media
              homepage banner.
            </p>
          </div>

          <Link to="/browse" className={styles.viewAllLink}>
            View all anime
          </Link>
        </div>

        {loading && <AnimeGridSkeleton count={3} />}

        {error && <div className={styles.errorBox}>Error: {error}</div>}

        {!loading && !error && topAnime.length === 0 && (
          <EmptyState
            title="No anime yet"
            message="No anime available right now."
          />
        )}

        {!loading && !error && featuredAnime ? (
          <div className={styles.bannerGrid}>
            <article className={styles.featuredBanner}>
              <img
                src={featuredAnime.imageUrl}
                alt={featuredAnime.title}
                className={styles.bannerImage}
              />

              <div className={styles.bannerOverlay} />

              <div className={styles.bannerContent}>
                <span className={styles.bannerRank}>
                  #{featuredIndex + 1} Top rated
                </span>

                <h3 className={styles.bannerTitle}>{featuredAnime.title}</h3>

                <div className={styles.bannerMeta}>
                  <RatingBadge
                    label="Global rating"
                    value={featuredAnime.averageRating}
                    emptyText="No rating"
                  />
                </div>

                <div className={styles.bannerActions}>
                  <Link
                    to={`/anime/${featuredAnime.id}`}
                    className={styles.watchAction}
                  >
                    View details
                  </Link>

                  <Link to="/browse" className={styles.moreAction}>
                    Browse more
                  </Link>
                </div>
              </div>
            </article>

            <div className={styles.bannerList} aria-label="Other top anime">
              {topAnime.map((anime, index) => {
                const isActive = index === featuredIndex;

                return (
                  <button
                    key={anime.id}
                    type="button"
                    onClick={() => handleSelectFeatured(index)}
                    className={styles.bannerListItem}
                    data-active={isActive ? "true" : "false"}
                  >
                    <span className={styles.listRank}>#{index + 1}</span>

                    <img
                      src={anime.imageUrl}
                      alt=""
                      className={styles.listThumb}
                      aria-hidden="true"
                    />

                    <span className={styles.listText}>
                      <span className={styles.listTitle}>{anime.title}</span>
                      <span className={styles.listRating}>
                        ★{" "}
                        {Number(anime.averageRating) > 0
                          ? Number(anime.averageRating).toFixed(1)
                          : "No rating"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {!loading && !error && sideAnime.length > 0 ? (
          <div className={styles.mobileBannerRail}>
            {sideAnime.map((anime, index) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className={styles.mobileBannerCard}
              >
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className={styles.mobileBannerImage}
                />

                <span className={styles.mobileBannerText}>
                  #{index + 2} {anime.title}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}