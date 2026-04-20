import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { getAnimeList, getGenres } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import SortSelect from "../components/SortSelect";

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
        setError(err.message || "Failed to load anime");
      } finally {
        setLoading(false);
      }
    }

    loadAnime();
  }, [search, selectedGenre, sort]);

  return (
    <div>
      <h1>Browse Anime</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <SearchBar value={search} onChange={setSearch} />
        <GenreFilter
          genres={genres}
          value={selectedGenre}
          onChange={setSelectedGenre}
        />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading && <p>Loading anime...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && animeList.length === 0 && (
        <p>No anime matched your filters.</p>
      )}

      {!loading && !error && animeList.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}