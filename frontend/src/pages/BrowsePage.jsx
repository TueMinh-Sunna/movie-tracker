import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnimeList, getGenres } from "../api/animeApi";

export default function BrowsePage() {
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
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", minWidth: "220px" }}
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="rating_desc">Rating: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="title_asc">Title: A to Z</option>
          <option value="title_desc">Title: Z to A</option>
        </select>
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
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <img
                src={anime.imageUrl}
                alt={anime.title}
                style={{
                  width: "100%",
                  height: "280px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <h3 style={{ margin: "0 0 8px 0" }}>{anime.title}</h3>
              <p style={{ margin: 0 }}>
                Average rating: {Number(anime.averageRating) === 0 ? "No ratings yet" : anime.averageRating}
              </p>            </Link>
          ))}
        </div>
      )}
    </div>
  );
}