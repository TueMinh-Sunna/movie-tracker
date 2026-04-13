import { apiFetch } from "./client";

export function getAnimeList({ search = "", genre = "", sort = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (genre.trim()) {
    params.set("genre", genre.trim());
  }

  if (sort.trim()) {
    params.set("sort", sort.trim());
  }

  const queryString = params.toString();
  const path = queryString ? `/api/anime?${queryString}` : "/api/anime";

  return apiFetch(path);
}

export function getGenres() {
  return apiFetch("/api/genres");
}