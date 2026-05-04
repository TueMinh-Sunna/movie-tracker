import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchlist,
  updateWatchlistEntry,
  removeFromWatchlist,
} from "../api/watchlistApi";
import EmptyState from "../components/EmptyState";
import RatingBadge from "../components/RatingBadge";
import RatingPicker from "../components/RatingPicker";
import styles from "./WatchlistPage.module.css";
import { WatchlistSkeleton } from "../components/Skeleton";
import { getAnimeById } from "../api/animeApi";

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "WATCH_LATER", label: "Watch later" },
  { value: "COMPLETED", label: "Completed" },
];

export default function WatchlistPage() {
  useDocumentTitle("My Watchlist");

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent_desc");
  const [savingAnimeId, setSavingAnimeId] = useState(null);

  async function loadWatchlist() {
    setLoading(true);
    setError("");

    try {
      const result = await getWatchlist();

      const entriesWithFreshRatings = await Promise.all(
        result.map(async (entry) => {
          try {
            const freshAnime = await getAnimeById(entry.animeId);

            return {
              ...entry,
              averageRating: freshAnime.averageRating,
            };
          } catch {
            return entry;
          }
        })
      );

      setEntries(entriesWithFreshRatings);
    } catch (err) {
      setError(err.message || "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  const totalCount = entries.length;
  const watchLaterCount = entries.filter(
    (entry) => entry.status === "WATCH_LATER"
  ).length;
  const completedCount = entries.filter(
    (entry) => entry.status === "COMPLETED"
  ).length;

  const filteredAndSortedEntries = useMemo(() => {
    const filtered =
      statusFilter === "ALL"
        ? entries
        : entries.filter((entry) => entry.status === statusFilter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "title_asc") {
        return String(a.title).localeCompare(String(b.title));
      }

      if (sortBy === "title_desc") {
        return String(b.title).localeCompare(String(a.title));
      }

      if (sortBy === "personal_desc") {
        return Number(b.personalRating ?? 0) - Number(a.personalRating ?? 0);
      }

      if (sortBy === "personal_asc") {
        return Number(a.personalRating ?? 0) - Number(b.personalRating ?? 0);
      }

      if (sortBy === "global_desc") {
        return Number(b.averageRating ?? 0) - Number(a.averageRating ?? 0);
      }

      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : Number(a.id ?? 0);
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : Number(b.id ?? 0);

      return bTime - aTime;
    });
  }, [entries, statusFilter, sortBy]);

  async function handleStatusChange(animeId, nextStatus, currentPersonalRating) {
    setSavingAnimeId(animeId);
    setError("");

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

  async function handleMarkCompleted(entry) {
    await handleStatusChange(
      entry.animeId,
      "COMPLETED",
      entry.personalRating
    );
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

  async function handleRemove(entry) {
    const confirmed = window.confirm(
      `Remove "${entry.title}" from Watch later?`
    );

    if (!confirmed) {
      return;
    }

    setSavingAnimeId(entry.animeId);
    setError("");

    try {
      await removeFromWatchlist(entry.animeId);
      await loadWatchlist();
    } catch (err) {
      setError(err.message || "Failed to remove anime from watchlist.");
    } finally {
      setSavingAnimeId(null);
    }
  }

  if (loading) {
    return <WatchlistSkeleton />;
  }

  return (
    <div className={styles.root}>
      <section className={styles.playlistHero}>
        <div className={styles.heroCover} aria-hidden="true">
          <span>▶</span>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>Watchlist</h1>

          <p className={styles.description}>
            Your saved anime, personal ratings, and completion progress in one
            playlist-style view.
          </p>

          <div className={styles.heroStats}>
            <span>{totalCount} saved</span>
            <span>{watchLaterCount} queued</span>
            <span>{completedCount} completed</span>
          </div>

          <div className={styles.heroActions}>
            <Link to="/browse" className={styles.primaryLink}>
              Browse anime
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.toolbar}>
        <div className={styles.tabRow}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={styles.tab}
              data-active={statusFilter === tab.value ? "true" : "false"}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className={styles.sortLabel}>
          Sort current view
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className={styles.sortSelect}
          >
            <option value="recent_desc">Recently updated</option>
            <option value="title_asc">Title: A to Z</option>
            <option value="title_desc">Title: Z to A</option>
            <option value="global_desc">Global rating: High to Low</option>
            <option value="personal_desc">Your rating: High to Low</option>
            <option value="personal_asc">Your rating: Low to High</option>
          </select>
        </label>
      </section>

      {error ? <div className={styles.errorBox}>Error: {error}</div> : null}

      {filteredAndSortedEntries.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState
            title="Nothing in this view"
            message="This playlist filter has no anime yet."
          />

          <div className={styles.emptyActions}>
            <Link to="/browse" className={styles.primaryLink}>
              Find anime
            </Link>

            {statusFilter !== "ALL" ? (
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={styles.secondaryButton}
              >
                Show all saved anime
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <section className={styles.playlistList}>
          {filteredAndSortedEntries.map((entry, index) => {
            const animeId = Number(entry.animeId);
            const isSaving = savingAnimeId === animeId;
            const isCompleted = entry.status === "COMPLETED";

            return (
              <article key={entry.id ?? animeId} className={styles.row}>
                <span className={styles.rowIndex}>{index + 1}</span>

                <Link to={`/anime/${animeId}`} className={styles.thumbnailLink}>
                  <img
                    src={entry.imageUrl}
                    alt={entry.title}
                    className={styles.thumbnail}
                  />
                </Link>

                <div className={styles.rowMain}>
                  <Link to={`/anime/${animeId}`} className={styles.titleLink}>
                    <h2 className={styles.entryTitle}>{entry.title}</h2>
                  </Link>

                  <div className={styles.metaRow}>
                    <span
                      className={styles.statusPill}
                      data-status={entry.status}
                    >
                      {isCompleted ? "Completed" : "Watch later"}
                    </span>

                    <RatingBadge
                      label="Global"
                      value={entry.averageRating}
                      compact
                      emptyText="No global rating"
                    />

                    <RatingBadge
                      label="Your"
                      value={entry.personalRating}
                      personal
                      compact
                      precision={0}
                      emptyText="Not rated"
                    />
                  </div>
                </div>

                <div className={styles.rowControls}>
                  <div className={styles.statusButtons}>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(
                          animeId,
                          "WATCH_LATER",
                          entry.personalRating
                        )
                      }
                      data-active={!isCompleted ? "true" : "false"}
                    >
                      Watch later
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(
                          animeId,
                          "COMPLETED",
                          entry.personalRating
                        )
                      }
                      data-active={isCompleted ? "true" : "false"}
                    >
                      Completed
                    </button>
                  </div>

                  <RatingPicker
                    value={entry.personalRating ?? ""}
                    disabled={isSaving}
                    compact
                    onChange={(nextValue) =>
                      handleRatingChange(animeId, entry.status, nextValue)
                    }
                  />

                  <div className={styles.actionRow}>


                    <button
                      type="button"
                      onClick={() => handleRemove(entry)}
                      disabled={isSaving}
                      className={styles.removeButton}
                    >
                      {isSaving ? "Working..." : "Remove"}
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