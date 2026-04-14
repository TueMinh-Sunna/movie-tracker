import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeById } from "../api/animeApi";
import { createComment, getCommentsByAnimeId } from "../api/commentApi";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { authState } from "../state/authState";
import {
  addToWatchlist,
  getWatchlistEntry,
  removeFromWatchlist,
  updateWatchlistEntry,
} from "../api/watchlistApi";
import WatchStatusSelect from "../components/WatchStatusSelect";
import RatingInput from "../components/RatingInput";

export default function AnimeDetailsPage() {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const auth = useRecoilValue(authState);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");

  const [watchEntry, setWatchEntry] = useState(null);
  const [watchLoading, setWatchLoading] = useState(false);
  const [watchError, setWatchError] = useState("");
  const [watchStatus, setWatchStatus] = useState("WATCH_LATER");
  const [personalRating, setPersonalRating] = useState("");

  async function loadComments() {
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const result = await getCommentsByAnimeId(id);
      setComments(result);
    } catch (err) {
      setCommentsError(err.message || "Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function loadWatchEntry() {
    if (!auth.user) {
      setWatchEntry(null);
      setWatchStatus("WATCH_LATER");
      setPersonalRating("");
      return;
    }

    setWatchLoading(true);
    setWatchError("");

    try {
      const result = await getWatchlistEntry(id);
      setWatchEntry(result);
      setWatchStatus(result.status || "WATCH_LATER");
      setPersonalRating(
        result.personalRating === null || result.personalRating === undefined
          ? ""
          : String(result.personalRating)
      );
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("404")) {
        setWatchEntry(null);
        setWatchStatus("WATCH_LATER");
        setPersonalRating("");
      } else {
        setWatchError(err.message || "Failed to load watchlist entry.");
      }
    } finally {
      setWatchLoading(false);
    }
  }

  async function loadAnimeDetails() {
    setLoading(true);
    setError("");

    try {
      const result = await getAnimeById(id);
      setAnime(result);
    } catch (err) {
      setError(err.message || "Failed to load anime details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnimeDetails();
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [id]);

  useEffect(() => {
    loadWatchEntry();
  }, [id, auth.user]);

  async function handleCreateComment(content) {
    await createComment(id, content);
    await loadComments();
  }

  async function handleAddToWatchlist() {
    setWatchLoading(true);
    setWatchError("");

    try {
      const parsedRating =
        String(personalRating).trim() === ""
          ? null
          : Number(personalRating);

      if (
        parsedRating !== null &&
        (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 10)
      ) {
        throw new Error("Personal rating must be a whole number from 1 to 10.");
      }

      await addToWatchlist({
        animeId: Number(id),
        status: watchStatus,
        personalRating: parsedRating,
      });

      await loadWatchEntry();
      await loadAnimeDetails();
    } catch (err) {
      setWatchError(err.message || "Failed to add to watchlist.");
    } finally {
      setWatchLoading(false);
    }
  }

  async function handleUpdateWatchlist() {
    setWatchLoading(true);
    setWatchError("");

    try {
      const parsedRating =
        String(personalRating).trim() === ""
          ? null
          : Number(personalRating);

      if (
        parsedRating !== null &&
        (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 10)
      ) {
        throw new Error("Personal rating must be a whole number from 1 to 10.");
      }

      await updateWatchlistEntry(id, {
        status: watchStatus,
        personalRating: parsedRating,
      });

      await loadWatchEntry();
      await loadAnimeDetails();
    } catch (err) {
      setWatchError(err.message || "Failed to update watchlist.");
    } finally {
      setWatchLoading(false);
    }
  }

  async function handleRemoveFromWatchlist() {
    setWatchLoading(true);
    setWatchError("");

    try {
      await removeFromWatchlist(id);
      setWatchEntry(null);
      setWatchStatus("WATCH_LATER");
      setPersonalRating("");
      await loadAnimeDetails();
    } catch (err) {
      setWatchError(err.message || "Failed to remove from watchlist.");
    } finally {
      setWatchLoading(false);
    }
  }

  if (loading) {
    return <p>Loading anime details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!anime) {
    return <p>Anime not found.</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Link
        to="/browse"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
        }}
      >
        ← Back to Browse
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={anime.imageUrl}
            alt={anime.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{anime.title}</h1>

          <p style={{ marginBottom: "12px", color: "#555" }}>
            <strong>Global rating:</strong>{" "}
            {Number(anime.averageRating) === 0
              ? "No ratings yet"
              : anime.averageRating}
          </p>

          <div style={{ marginBottom: "16px" }}>
            <strong>Genres:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {anime.genres && anime.genres.length > 0 ? (
                anime.genres.map((genre) => (
                  <span
                    key={genre.id ?? genre.name ?? genre}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #ccc",
                      borderRadius: "999px",
                      fontSize: "14px",
                    }}
                  >
                    {genre.name ?? genre}
                  </span>
                ))
              ) : (
                <span>No genres</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <strong>Synopsis:</strong>
            <p style={{ lineHeight: "1.6" }}>
              {anime.synopsis || "No synopsis available."}
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Comments</h2>

            {auth.user ? (
              <div style={{ marginBottom: "20px" }}>
                <CommentForm onSubmit={handleCreateComment} />
              </div>
            ) : (
              <p style={{ marginBottom: "20px", color: "#555" }}>
                Log in to comment.
              </p>
            )}

            {commentsLoading && <p>Loading comments...</p>}

            {commentsError && (
              <p style={{ color: "crimson" }}>Error: {commentsError}</p>
            )}

            {!commentsLoading && !commentsError && (
              <CommentList comments={comments} />
            )}

            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid #eee",
                paddingTop: "20px",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "16px" }}>My watchlist</h2>

              {!auth.user ? (
                <p style={{ margin: 0, color: "#555" }}>
                  Log in to add this anime to your watchlist.
                </p>
              ) : (
                <>
                  {watchError && (
                    <p style={{ color: "crimson", marginBottom: "12px" }}>
                      Error: {watchError}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "end",
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
                        value={watchStatus}
                        disabled={watchLoading}
                        onChange={setWatchStatus}
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
                        value={personalRating}
                        disabled={watchLoading}
                        onChange={setPersonalRating}
                      />
                    </div>
                  </div>

                  {watchEntry ? (
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button onClick={handleUpdateWatchlist} disabled={watchLoading}>
                        {watchLoading ? "Saving..." : "Update watchlist"}
                      </button>

                      <button
                        onClick={handleRemoveFromWatchlist}
                        disabled={watchLoading}
                      >
                        {watchLoading ? "Working..." : "Remove from watchlist"}
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleAddToWatchlist} disabled={watchLoading}>
                      {watchLoading ? "Adding..." : "Add to watchlist"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}