import { apiFetch } from "./client";
import {
  normalizeAnime,
  normalizeAnimeList,
  normalizeGenreList,
} from "../mappers/animeMappers";

export async function getAnimeList({ search = "", genre = "", sort = "" } = {}) {
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

  const data = await apiFetch(path);
  return normalizeAnimeList(data);
}

export async function getAnimeById(id) {
  const data = await apiFetch(`/api/anime/${id}`);
  return normalizeAnime(data);
}

export async function getGenres() {
  const data = await apiFetch("/api/genres");
  return normalizeGenreList(data);
}