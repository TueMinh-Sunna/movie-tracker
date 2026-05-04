import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useMemo, useState } from "react";
import { getAnimeList, getGenres } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import SortSelect from "../components/SortSelect";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import styles from "./BrowsePage.module.css";

export default function BrowsePage() {
  useDocumentTitle("Browse");

  const [animeList, setAnimeList] = useState([]);
  const [genres, setGenres] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sort, setSort] = useState("rating_desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGenres() {
      try {
        const result = await getGenres();
        setGenres(result);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }

    loadGenres();
  }, []);

  useEffect(() => {
    async function loadAnime() {
      setLoading(true);
      setError("");

      try {
        const result = await getAnimeList({
          search,
          genre: selectedGenre,
          sort,
        });
        setAnimeList(result);
      } catch (err) {
        setError(err.message || "Failed to load anime.");
      } finally {
        setLoading(false);
      }
    }

    loadAnime();
  }, [search, selectedGenre, sort]);

  const hasActiveFilters = search.trim() || selectedGenre || sort !== "rating_desc";

  const resultsLabel = useMemo(() => {
    if (loading) {
      return "Loading results...";
    }

    if (error) {
      return "Could not load results.";
    }

    if (animeList.length === 0) {
      return "No anime found.";
    }

    return `${animeList.length} anime found`;
  }, [loading, error, animeList]);

  function handleClearFilters() {
    setSearch("");
    setSelectedGenre("");
    setSort("rating_desc");
  }

  return (
    <div className={styles.root}>
      <section className={styles.header}>
        <h1 className={styles.title}>Browse Anime</h1>
        <p className={styles.description}>
          Search by title, narrow the list by genre, and sort titles by rating
          or name to quickly find something to watch.
        </p>
      </section>

      <section className={styles.filtersSurface}>
        <div className={styles.filtersRow}>
          <SearchBar value={search} onChange={setSearch} />
          <GenreFilter
            genres={genres}
            value={selectedGenre}
            onChange={setSelectedGenre}
          />
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <div className={styles.resultsRow}>
          <span className={styles.resultsText}>{resultsLabel}</span>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className={styles.clearButton}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      <section className={styles.feedbackArea}>
        {loading && <LoadingState message="Loading anime..." />}

        {error && <div className={styles.errorBox}>Error: {error}</div>}

        {!loading && !error && animeList.length === 0 && (
          <EmptyState
            title="No anime matched your filters"
            message="Try changing the search text, genre, or sorting option."
          />
        )}

        {!loading && !error && animeList.length > 0 && (
          <div className={styles.grid}>
            {animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}