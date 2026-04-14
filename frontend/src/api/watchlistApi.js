import { apiFetch } from "./client";

export function getWatchlist() {
  return apiFetch("/api/watchlist");
}

export function getWatchlistEntry(animeId) {
  return apiFetch(`/api/watchlist/${animeId}`);
}

export function addToWatchlist({ animeId, status = "WATCH_LATER", personalRating = null }) {
  return apiFetch("/api/watchlist", {
    method: "POST",
    body: JSON.stringify({
      animeId,
      status,
      personalRating,
    }),
  });
}

export function updateWatchlistEntry(animeId, { status, personalRating }) {
  return apiFetch(`/api/watchlist/${animeId}`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      personalRating,
    }),
  });
}

export function removeFromWatchlist(animeId) {
  return apiFetch(`/api/watchlist/${animeId}`, {
    method: "DELETE",
  });
}