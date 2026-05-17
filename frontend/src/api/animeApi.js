import { apiFetch } from "./client";
import {
  normalizeAnime,
  normalizeAnimeList,
  normalizeGenreList,
} from "../mappers/animeMappers";

export async function getAnimeList({
  search = "",
  genre = "",
  sort = "",
  page = 0,
  size = 12,
} = {}) {
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

  params.set("page", String(page));
  params.set("size", String(size));

  const data = await apiFetch(`/api/anime?${params.toString()}`);

  return {
    ...data,
    content: normalizeAnimeList(data.content || []),
  };
}

export async function getAnimeById(id) {
  const data = await apiFetch(`/api/anime/${id}`);
  return normalizeAnime(data);
}

export async function getGenres() {
  const data = await apiFetch("/api/genres");
  return normalizeGenreList(data);
}