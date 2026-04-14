import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getAnimeList } from "../api/animeApi";
import AnimeCard from "../components/AnimeCard";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { authState } from "../state/authState";

export default function HomePage() {
  const auth = useRecoilValue(authState);

  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopAnime() {
      setLoading(true);
      setError("");

      try {
        const result = await getAnimeList({ sort: "rating_desc" });
        setTopAnime(result.slice(0, 6));
      } catch (err) {
        setError(err.message || "Failed to load top anime.");
      } finally {
        setLoading(false);
      }
    }

    loadTopAnime();
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <section
        style={{
          padding: "32px 0",
          borderBottom: "1px solid #eee",
          marginBottom: "32px",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "12px", fontSize: "36px" }}>
          Mini Anime List
        </h1>

        <p style={{ fontSize: "18px", lineHeight: "1.6", maxWidth: "700px" }}>
          Browse anime, read details, post comments, and manage your own personal
          watchlist with statuses and ratings.
        </p>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Top rated anime</h2>

          <Link to="/browse" style={{ textDecoration: "none" }}>
            View all
          </Link>
        </div>

        {loading && <LoadingState message="Loading top anime..." />}

        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

        {!loading && !error && topAnime.length === 0 && (
          <EmptyState message="No anime available right now." />
        )}

        {!loading && !error && topAnime.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {topAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}