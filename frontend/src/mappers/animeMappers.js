export function normalizeGenre(genre) {
  if (!genre) {
    return { id: "", name: "" };
  }

  if (typeof genre === "string") {
    return {
      id: genre,
      name: genre,
    };
  }

  return {
    id: genre.id ?? genre.name ?? "",
    name: genre.name ?? "",
  };
}

export function normalizeAnime(anime) {
  return {
    id: anime.id,
    title: anime.title ?? "",
    synopsis: anime.synopsis ?? "",
    imageUrl: anime.imageUrl ?? "",
    averageRating: Number(anime.averageRating ?? 0),
    genres: Array.isArray(anime.genres)
      ? anime.genres.map(normalizeGenre)
      : [],
  };
}

export function normalizeAnimeList(animeList) {
  if (!Array.isArray(animeList)) {
    return [];
  }

  return animeList.map(normalizeAnime);
}

export function normalizeGenreList(genres) {
  if (!Array.isArray(genres)) {
    return [];
  }

  return genres.map(normalizeGenre);
}