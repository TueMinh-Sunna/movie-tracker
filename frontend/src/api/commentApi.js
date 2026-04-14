import { apiFetch } from "./client";

export function getCommentsByAnimeId(animeId) {
  return apiFetch(`/api/anime/${animeId}/comments`);
}

export function createComment(animeId, content) {
  return apiFetch(`/api/anime/${animeId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}