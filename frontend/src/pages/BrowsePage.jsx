import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeList, getGenres } from "../api/animeApi";
import { addToWatchlist, getWatchlist } from "../api/watchlistApi";
import AnimeCard from "../components/AnimeCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import SortSelect from "../components/SortSelect";
import EmptyState from "../components/EmptyState";
import WatchLaterButton from "../components/WatchLaterButton";
import { authState } from "../state/authState";
import useDebouncedValue from "../hooks/useDebouncedValue";
import {
  readLocalStorage,
  writeLocalStorage,
} from "../hooks/useLocalStorage";
import styles from "./BrowsePage.module.css";
import { AnimeGridSkeleton } from "../components/Skeleton";

const DEFAULT_SORT = "rating_desc";
const BROWSE_FILTERS_STORAGE_KEY = "miniAnimeListBrowseFilters";

export default function BrowsePage() {
  useDocumentTitle("Browse");

  const auth = useRecoilValue(authState);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const selectedGenre = searchParams.get("genre") ?? "";
  const sort = searchParams.get("sort") ?? DEFAULT_SORT;

  const debouncedSearch = useDebouncedValue(search, 300);

  const [filtersReady, setFiltersReady] = useState(false);

  const [animeList, setAnimeList] = useState([]);
  const [genres, setGenres] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [watchlistAnimeIds, setWatchlistAnimeIds] = useState(new Set());
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [addingAnimeId, setAddingAnimeId] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState("");

  function updateBrowseParam(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === DEFAULT_SORT) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  }

  function handleSearchChange(nextSearch) {
    updateBrowseParam("q", nextSearch);
  }

  function handleGenreChange(nextGenre) {
    updateBrowseParam("genre", nextGenre);
  }

  function handleSortChange(nextSort) {
    updateBrowseParam("sort", nextSort);
  }

  function handleClearFilters() {
    setSearchParams({});
  }

  async function handleQuickAdd(animeId) {
    if (!auth.user) {
      return;
    }

    const numericAnimeId = Number(animeId);

    if (watchlistAnimeIds.has(numericAnimeId)) {
      setWatchlistMessage("Already saved to Watch later.");
      return;
    }

    setAddingAnimeId(numericAnimeId);
    setWatchlistMessage("");

    try {
      await addToWatchlist({
        animeId: numericAnimeId,
        status: "WATCH_LATER",
        personalRating: null,
      });

      setWatchlistAnimeIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(numericAnimeId);
        return nextIds;
      });

      setWatchlistMessage("Saved to Watch later.");
    } catch (err) {
      const message = String(err.message || "").toLowerCase();

      const alreadyExists =
        err.status === 409 ||
        message.includes("already") ||
        message.includes("duplicate") ||
        message.includes("exists");

      if (alreadyExists) {
        setWatchlistAnimeIds((currentIds) => {
          const nextIds = new Set(currentIds);
          nextIds.add(numericAnimeId);
          return nextIds;
        });

        setWatchlistMessage("Already saved to Watch later.");
      } else {
        setWatchlistMessage(err.message || "Failed to save anime.");
      }
    } finally {
      setAddingAnimeId(null);
    }
  }

  useEffect(() => {
    if (filtersReady) {
      return;
    }

    if (searchParams.toString()) {
      setFiltersReady(true);
      return;
    }

    const savedFilters = readLocalStorage(BROWSE_FILTERS_STORAGE_KEY, null);

    if (!savedFilters) {
      setFiltersReady(true);
      return;
    }

    const nextParams = new URLSearchParams();

    if (savedFilters.search) {
      nextParams.set("q", savedFilters.search);
    }

    if (savedFilters.genre) {
      nextParams.set("genre", savedFilters.genre);
    }

    if (savedFilters.sort && savedFilters.sort !== DEFAULT_SORT) {
      nextParams.set("sort", savedFilters.sort);
    }

    if (nextParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    } else {
      setFiltersReady(true);
    }
  }, [filtersReady, searchParams, setSearchParams]);

  useEffect(() => {
    if (!filtersReady) {
      return;
    }

    writeLocalStorage(BROWSE_FILTERS_STORAGE_KEY, {
      search,
      genre: selectedGenre,
      sort,
    });
  }, [filtersReady, search, selectedGenre, sort]);

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
    async function loadUserWatchlist() {
      if (!auth.user) {
        setWatchlistAnimeIds(new Set());
        setWatchlistMessage("");
        return;
      }

      setWatchlistLoading(true);

      try {
        const entries = await getWatchlist();
        const nextIds = new Set(entries.map((entry) => Number(entry.animeId)));
        setWatchlistAnimeIds(nextIds);
      } catch (err) {
        setWatchlistMessage(
          err.message || "Failed to load your saved anime status."
        );
      } finally {
        setWatchlistLoading(false);
      }
    }

    loadUserWatchlist();
  }, [auth.user]);

  useEffect(() => {
    if (!filtersReady) {
      return;
    }

    async function loadAnime() {
      setLoading(true);
      setError("");

      try {
        const result = await getAnimeList({
          search: debouncedSearch,
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
  }, [filtersReady, debouncedSearch, selectedGenre, sort]);

  const hasActiveFilters =
    search.trim() || selectedGenre || sort !== DEFAULT_SORT;

  const resultsLabel = useMemo(() => {
    if (loading) {
      return "Searching anime...";
    }

    if (error) {
      return "Could not load results.";
    }

    const count = animeList.length;

    if (!hasActiveFilters) {
      return `${count} anime available`;
    }

    if (count === 0) {
      return "No anime match your filters";
    }

    return `${count} anime match your filters`;
  }, [loading, error, animeList.length, hasActiveFilters]);

  return (
    <div className={styles.root}>
      <section className={styles.header}>
        <h1 className={styles.title}>Browse Anime</h1>
        <p className={styles.description}>
          Search by title, filter by genre, and save anime to your Watch later
          list.
        </p>
      </section>

      <section className={styles.filtersSurface}>
        <div className={styles.filtersRow}>
          <SearchBar value={search} onChange={handleSearchChange} />

          <GenreFilter
            genres={genres}
            value={selectedGenre}
            onChange={handleGenreChange}
          />

          <SortSelect value={sort} onChange={handleSortChange} />
        </div>

        <div className={styles.resultsRow}>
          <span className={styles.resultsText}>{resultsLabel}</span>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className={styles.clearButton}
            >
              Reset search and filters
            </button>
          ) : null}
        </div>

        {watchlistMessage ? (
          <div className={styles.infoBox}>{watchlistMessage}</div>
        ) : null}
      </section>

      <section className={styles.feedbackArea}>
        {loading && <AnimeGridSkeleton count={8} />}

        {error && <div className={styles.errorBox}>Error: {error}</div>}

        {!loading && !error && animeList.length === 0 && (
          <EmptyState
            title="No anime matched your filters"
            message="Try changing the search text, genre, or sorting option."
          />
        )}

        {!loading && !error && animeList.length > 0 && (
          <div className={styles.grid}>
            {animeList.map((anime) => {
              const animeId = Number(anime.id);
              const isSaved = watchlistAnimeIds.has(animeId);
              const isAdding = addingAnimeId === animeId;

              return (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  actions={
                    auth.user ? (
                      <WatchLaterButton
                        isSaved={isSaved}
                        isLoading={isAdding}
                        disabled={watchlistLoading}
                        onClick={() => handleQuickAdd(animeId)}
                        variant="card"
                        defaultLabel="Watch later"
                        savedLabel="Saved"
                        loadingLabel="Saving..."
                      />
                    ) : null
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}