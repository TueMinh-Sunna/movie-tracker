import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchlist,
  updateWatchlistEntry,
  removeFromWatchlist,
} from "../api/watchlistApi";
import WatchStatusSelect from "../components/WatchStatusSelect";
import RatingInput from "../components/RatingInput";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import styles from "./WatchlistPage.module.css";

export default function WatchlistPage() {
  useDocumentTitle("My Watchlist");

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [savingAnimeId, setSavingAnimeId] = useState(null);

  async function loadWatchlist() {
    setLoading(true);
    setError("");

    try {
      const result = await getWatchlist();
      setEntries(result);
    } catch (err) {
      setError(err.message || "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  const filteredEntries = useMemo(() => {
    if (statusFilter === "ALL") {
      return entries;
    }

    return entries.filter((entry) => entry.status === statusFilter);
  }, [entries, statusFilter]);

  const totalCount = entries.length;
  const watchLaterCount = entries.filter(
    (entry) => entry.status === "WATCH_LATER"
  ).length;
  const completedCount = entries.filter(
    (entry) => entry.status === "COMPLETED"
  ).length;

  async function handleStatusChange(animeId, nextStatus, currentPersonalRating) {
    setSavingAnimeId(animeId);

    try {
      await updateWatchlistEntry(animeId, {
        status: nextStatus,
        personalRating: currentPersonalRating,
      });

      await loadWatchlist();
    } catch (err) {
      const backendFieldError =
        err.validationErrors?.status || err.validationErrors?.personalRating;

      setError(backendFieldError || err.message || "Failed to update status.");
    } finally {
      setSavingAnimeId(null);
    }
  }

  async function handleRatingChange(animeId, status, nextRatingValue) {
    const trimmed = String(nextRatingValue).trim();

    let personalRating = null;

    if (trimmed !== "") {
      const parsed = Number(trimmed);

      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
        setError("Personal rating must be a whole number from 1 to 10.");
        return;
      }

      personalRating = parsed;
    }

    setSavingAnimeId(animeId);
    setError("");

    try {
      await updateWatchlistEntry(animeId, {
        status,
        personalRating,
      });

      await loadWatchlist();
    } catch (err) {
      const backendFieldError =
        err.validationErrors?.personalRating || err.validationErrors?.status;

      setError(backendFieldError || err.message || "Failed to update rating.");
    } finally {
      setSavingAnimeId(null);
    }
  }

  async function handleRemove(animeId) {
    setSavingAnimeId(animeId);
    setError("");

    try {
      await removeFromWatchlist(animeId);
      await loadWatchlist();
    } catch (err) {
      setError(err.message || "Failed to remove anime from watchlist.");
    } finally {
      setSavingAnimeId(null);
    }
  }

  if (loading) {
    return <LoadingState message="Loading your watchlist..." />;
  }

  return (
    <div className={styles.root}>
      <section className={styles.header}>
        <h1 className={styles.title}>My Watchlist</h1>
        <p className={styles.description}>
          Track what you still want to watch, what you have completed, and the
          personal ratings you have given.
        </p>
      </section>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total entries</span>
          <span className={styles.summaryValue}>{totalCount}</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Watch later</span>
          <span className={styles.summaryValue}>{watchLaterCount}</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Completed</span>
          <span className={styles.summaryValue}>{completedCount}</span>
        </div>
      </section>

      <section className={styles.filtersCard}>
        <div className={styles.filtersHeader}>
          <div>
            <h2 className={styles.filtersTitle}>Filter entries</h2>
            <p className={styles.filtersDescription}>
              Switch between all items, planned shows, and completed ones.
            </p>
          </div>

          <span className={styles.resultsText}>
            {filteredEntries.length} item{filteredEntries.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className={styles.tabRow}>
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`${styles.tab} ${statusFilter === "ALL" ? styles.tabActive : ""
              }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("WATCH_LATER")}
            className={`${styles.tab} ${statusFilter === "WATCH_LATER" ? styles.tabActive : ""
              }`}
          >
            Watch later
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`${styles.tab} ${statusFilter === "COMPLETED" ? styles.tabActive : ""
              }`}
          >
            Completed
          </button>
        </div>
      </section>

      {error ? <div className={styles.errorBox}>Error: {error}</div> : null}

      {filteredEntries.length === 0 ? (
        <EmptyState
          title="No watchlist entries"
          message="Your watchlist is empty for this filter."
        />
      ) : (
        <section className={styles.list}>
          {filteredEntries.map((entry) => {
            const anime = {
              id: entry.animeId,
              title: entry.title,
              imageUrl: entry.imageUrl,
              averageRating: entry.averageRating,
            };

            const isSaving = savingAnimeId === anime.id;
            const hasGlobalRating = Number(anime.averageRating) > 0;
            return (
              <article
                key={entry.id ?? anime.id}
                className={styles.entryCard}
              >
                <Link
                  to={`/anime/${anime.id}`}
                  className={styles.posterLink}
                >
                  <div className={styles.posterWrap}>
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className={styles.poster}
                    />
                  </div>
                </Link>

                <div className={styles.entryBody}>
                  <div className={styles.entryHeader}>
                    <Link
                      to={`/anime/${anime.id}`}
                      className={styles.titleLink}
                    >
                      <h2 className={styles.entryTitle}>{anime.title}</h2>
                    </Link>

                    <div className={styles.metaRow}>
                      <span
                        className={`${styles.metaPill} ${styles.metaPillAccent}`}
                      >
                        {entry.status === "WATCH_LATER"
                          ? "Watch later"
                          : "Completed"}
                      </span>

                      <span className={styles.metaPill}>
                        {hasGlobalRating
                          ? `Global rating: ${Number(anime.averageRating).toFixed(1)}`
                          : "No ratings yet"}
                      </span>

                      <span className={styles.metaPill}>
                        {entry.personalRating
                          ? `Your rating: ${entry.personalRating}`
                          : "No personal rating"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Status</label>
                      <WatchStatusSelect
                        value={entry.status}
                        disabled={isSaving}
                        onChange={(nextStatus) =>
                          handleStatusChange(
                            anime.id,
                            nextStatus,
                            entry.personalRating
                          )
                        }
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Personal rating</label>
                      <RatingInput
                        value={entry.personalRating ?? ""}
                        disabled={isSaving}
                        onChange={(nextValue) =>
                          handleRatingChange(anime.id, entry.status, nextValue)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => handleRemove(anime.id)}
                      disabled={isSaving}
                      className={styles.removeButton}
                    >
                      {isSaving ? "Working..." : "Remove from watchlist"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}