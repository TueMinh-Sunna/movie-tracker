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

export default function WatchlistPage() {
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

      setError(
        backendFieldError ||
        err.message ||
        "Failed to update status."
      );
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

      setError(
        backendFieldError ||
        err.message ||
        "Failed to update rating."
      );
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
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>My Watchlist</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <strong>Filter:</strong>

        <button onClick={() => setStatusFilter("ALL")}>All</button>
        <button onClick={() => setStatusFilter("WATCH_LATER")}>Watch later</button>
        <button onClick={() => setStatusFilter("COMPLETED")}>Completed</button>
      </div>

      {error && (
        <p style={{ color: "crimson", marginBottom: "16px" }}>
          Error: {error}
        </p>
      )}

      {filteredEntries.length === 0 ? (
        <EmptyState message="Your watchlist is empty for this filter." />
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredEntries.map((entry) => {
            const anime = entry.anime;
            const isSaving = savingAnimeId === anime.id;

            return (
              <div
                key={entry.id ?? anime.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: "#fff",
                }}
              >
                <Link to={`/anime/${anime.id}`}>
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </Link>

                <div>
                  <Link
                    to={`/anime/${anime.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
                      {anime.title}
                    </h2>
                  </Link>

                  <p style={{ marginTop: 0, color: "#555" }}>
                    Global rating:{" "}
                    {Number(anime.averageRating) === 0
                      ? "No ratings yet"
                      : anime.averageRating}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        Status
                      </label>
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

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        Personal rating
                      </label>
                      <RatingInput
                        value={entry.personalRating ?? ""}
                        disabled={isSaving}
                        onChange={(nextValue) =>
                          handleRatingChange(anime.id, entry.status, nextValue)
                        }
                      />
                    </div>
                  </div>

                  <button onClick={() => handleRemove(anime.id)} disabled={isSaving}>
                    {isSaving ? "Working..." : "Remove from watchlist"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}