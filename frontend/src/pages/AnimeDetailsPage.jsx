import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { Link, createSearchParams, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeById } from "../api/animeApi";
import { createComment, getCommentsByAnimeId } from "../api/commentApi";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import WatchLaterButton from "../components/WatchLaterButton";
import RatingBadge from "../components/RatingBadge";
import RatingPicker from "../components/RatingPicker";
import { authState } from "../state/authState";
import {
  addToWatchlist,
  getWatchlistEntry,
  removeFromWatchlist,
  updateWatchlistEntry,
} from "../api/watchlistApi";
import styles from "./AnimeDetailsPage.module.css";
import { DetailsPageSkeleton } from "../components/Skeleton";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const auth = useRecoilValue(authState);

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");

  const [watchEntry, setWatchEntry] = useState(null);
  const [watchLoading, setWatchLoading] = useState(false);
  const [watchError, setWatchError] = useState("");
  const [watchStatus, setWatchStatus] = useState("WATCH_LATER");
  const [personalRating, setPersonalRating] = useState("");
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  const originalStatus = watchEntry?.status ?? "WATCH_LATER";

  const originalRating =
    watchEntry?.personalRating === null ||
      watchEntry?.personalRating === undefined
      ? ""
      : String(watchEntry.personalRating);

  const hasChanges =
    watchStatus !== originalStatus ||
    String(personalRating) !== originalRating;

  useDocumentTitle(anime ? anime.title : "Anime Details");

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
      if (
        err.status === 404 ||
        String(err.message || "").toLowerCase().includes("not found")
      ) {
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

  useEffect(() => {
    loadAnimeDetails();
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [id]);

  useEffect(() => {
    loadWatchEntry();
  }, [id, auth.user]);

  function parsePersonalRating() {
    const trimmedRating = String(personalRating).trim();

    if (trimmedRating === "") {
      return null;
    }

    const parsedRating = Number(trimmedRating);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 10
    ) {
      throw new Error("Personal rating must be a whole number from 1 to 10.");
    }

    return parsedRating;
  }

  async function handleCreateComment(content) {
    await createComment(id, content);
    await loadComments();
  }

  async function handleAddToWatchlist() {
    setWatchLoading(true);
    setWatchError("");

    try {
      const parsedRating = parsePersonalRating();

      await addToWatchlist({
        animeId: Number(id),
        status: watchStatus,
        personalRating: parsedRating,
      });

      await loadWatchEntry();
      await loadAnimeDetails();
    } catch (err) {
      const backendFieldError =
        err.validationErrors?.personalRating || err.validationErrors?.status;

      setWatchError(
        backendFieldError || err.message || "Failed to add to watchlist."
      );
    } finally {
      setWatchLoading(false);
    }
  }

  async function handleUpdateWatchlist() {
    setWatchLoading(true);
    setWatchError("");

    try {
      const parsedRating = parsePersonalRating();

      await updateWatchlistEntry(id, {
        status: watchStatus,
        personalRating: parsedRating,
      });

      await loadWatchEntry();
      await loadAnimeDetails();
    } catch (err) {
      const backendFieldError =
        err.validationErrors?.personalRating || err.validationErrors?.status;

      setWatchError(
        backendFieldError || err.message || "Failed to update watchlist."
      );
    } finally {
      setWatchLoading(false);
    }
  }

  async function handleRemoveFromWatchlist() {
    const confirmed = window.confirm(
      anime ? `Remove "${anime.title}" from Watch later?` : "Remove from list?"
    );

    if (!confirmed) {
      return;
    }

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
    return <DetailsPageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.pageFeedback}>
        <div className={styles.errorBox}>Error: {error}</div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className={styles.pageFeedback}>
        <EmptyState
          title="Anime not found"
          message="The anime you tried to open could not be found."
        />
      </div>
    );
  }

  const synopsis = anime.synopsis || "No synopsis available.";
  const shouldCollapseSynopsis = synopsis.length > 280;
  const visibleSynopsis =
    shouldCollapseSynopsis && !isSynopsisExpanded
      ? `${synopsis.slice(0, 280).trim()}...`
      : synopsis;

  return (
    <div className={styles.root}>
      <Link to="/browse" className={styles.backLink}>
        ← Back to Browse
      </Link>

      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          <img
            src={anime.imageUrl}
            alt={anime.title}
            className={styles.poster}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{anime.title}</h1>

            <div className={styles.ratingStrip}>
              <RatingBadge
                label="Global rating"
                value={anime.averageRating}
                emptyText="No rating"
              />

              <RatingBadge
                label="Your rating"
                value={personalRating}
                personal
                precision={0}
                emptyText={
                  auth.user ? (
                    "Not rated"
                  ) : (
                    <Link to="/login" className={styles.inlineLink}>
                      Log in
                    </Link>
                  )
                } />

              <span className={styles.commentBadge}>
                {comments.length} comment{comments.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className={styles.genreSection}>
            <p className={styles.sectionLabel}>Genres</p>

            <div className={styles.genreList}>
              {anime.genres.length > 0 ? (
                anime.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={{
                      pathname: "/browse",
                      search: createSearchParams({
                        genre: genre.name,
                      }).toString(),
                    }}
                    className={styles.genreChip}
                  >
                    {genre.name}
                  </Link>
                ))
              ) : (
                <span className={styles.genreChip}>No genres</span>
              )}
            </div>
          </div>

          <div className={styles.synopsisCard}>
            <p className={styles.sectionLabel}>Synopsis</p>
            <p className={styles.synopsisText}>{visibleSynopsis}</p>

            {shouldCollapseSynopsis ? (
              <button
                type="button"
                onClick={() => setIsSynopsisExpanded((current) => !current)}
                className={styles.synopsisToggle}
                aria-expanded={isSynopsisExpanded}
              >
                {isSynopsisExpanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.commentsCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Comments</h2>
            <span className={styles.sectionDescription}>
              Read what other viewers think
            </span>
          </div>

          {auth.user ? (
            <CommentForm onSubmit={handleCreateComment} />
          ) : (
            <div className={styles.infoBox}>
              <Link to="/login" className={styles.inlineLink}>
                Log in
              </Link>{" "}
              to comment.
            </div>)}

          {commentsLoading && (
            <LoadingState message="Loading comments..." compact />
          )}

          {commentsError && (
            <div className={styles.errorBox}>Error: {commentsError}</div>
          )}

          {!commentsLoading && !commentsError && comments.length === 0 && (
            <EmptyState
              compact
              title="No comments yet"
              message="Be the first to share your thoughts about this anime."
            />
          )}

          {!commentsLoading && !commentsError && comments.length > 0 && (
            <CommentList comments={comments} />
          )}
        </section>

        <aside className={styles.watchlistCard}>
          <div className={styles.playlistHeader}>
            <div className={styles.playlistIcon} aria-hidden="true">
              ▶
            </div>

            <div>
              <h2 className={styles.playlistTitle}>Watchlist</h2>
              <p className={styles.playlistDescription}>
                Save this anime, mark your progress, and rate it like a title
                page.
              </p>
            </div>
          </div>

          {!auth.user ? (
            <div className={styles.infoBox}>
              <Link to="/login" className={styles.inlineLink}>
                Log in
              </Link>{" "}
              to save this anime to your Watch later list and add a personal
              rating.
            </div>
          ) : (
            <div className={styles.watchFields}>
              {watchError ? (
                <div className={styles.errorBox}>Error: {watchError}</div>
              ) : null}

              <WatchLaterButton
                isSaved={Boolean(watchEntry)}
                isLoading={watchLoading}
                disabled={watchLoading}
                onClick={handleAddToWatchlist}
                variant="panel"
                defaultLabel="Save to Watch later"
                savedLabel="Saved to Watch later"
                loadingLabel="Saving..."
              />

              <div className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <span className={styles.sectionLabel}>Status</span>
                  <span className={styles.statusHint}>
                    {watchStatus === "COMPLETED" ? "Finished" : "Queued"}
                  </span>
                </div>

                <div className={styles.statusSegment}>
                  <button
                    type="button"
                    onClick={() => setWatchStatus("WATCH_LATER")}
                    disabled={watchLoading}
                    data-active={
                      watchStatus === "WATCH_LATER" ? "true" : "false"
                    }
                  >
                    Watch later
                  </button>

                  <button
                    type="button"
                    onClick={() => setWatchStatus("COMPLETED")}
                    disabled={watchLoading}
                    data-active={
                      watchStatus === "COMPLETED" ? "true" : "false"
                    }
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className={styles.ratingCard}>
                <div className={styles.statusHeader}>
                  <span className={styles.sectionLabel}>Your rating</span>
                </div>

                <RatingPicker
                  value={personalRating}
                  disabled={watchLoading}
                  onChange={setPersonalRating}
                />
              </div>

              <div className={styles.watchActions}>
                {watchEntry ? (
                  <>
                    <button
                      type="button"
                      onClick={handleUpdateWatchlist}
                      disabled={watchLoading || !hasChanges}
                      className={styles.primaryButton}
                    >
                      {watchLoading ? "Saving..." : "Save changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFromWatchlist}
                      disabled={watchLoading}
                      className={styles.dangerButton}
                    >
                      {watchLoading ? "Working..." : "Remove from list"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToWatchlist}
                    disabled={watchLoading}
                    className={styles.primaryButton}
                  >
                    {watchLoading ? "Saving..." : "Save with rating"}
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}