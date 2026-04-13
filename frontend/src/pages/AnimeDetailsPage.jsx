import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAnimeById } from "../api/animeApi";

export default function AnimeDetailsPage() {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnimeDetails() {
      setLoading(true);
      setError("");

      try {
        const result = await getAnimeById(id);
        setAnime(result);
      } catch (err) {
        setError(err.message || "Failed to load anime details");
      } finally {
        setLoading(false);
      }
    }

    loadAnimeDetails();
  }, [id]);

  if (loading) {
    return <p>Loading anime details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!anime) {
    return <p>Anime not found.</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Link
        to="/browse"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
        }}
      >
        ← Back to Browse
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={anime.imageUrl}
            alt={anime.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{anime.title}</h1>

          <p style={{ marginBottom: "12px", color: "#555" }}>
            <strong>Global rating:</strong>{" "}
            {Number(anime.averageRating) === 0
              ? "No ratings yet"
              : anime.averageRating}
          </p>

          <div style={{ marginBottom: "16px" }}>
            <strong>Genres:</strong>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {anime.genres && anime.genres.length > 0 ? (
                anime.genres.map((genre) => (
                  <span
                    key={genre.id ?? genre.name ?? genre}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #ccc",
                      borderRadius: "999px",
                      fontSize: "14px",
                    }}
                  >
                    {genre.name ?? genre}
                  </span>
                ))
              ) : (
                <span>No genres</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <strong>Synopsis:</strong>
            <p style={{ lineHeight: "1.6" }}>
              {anime.synopsis || "No synopsis available."}
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Coming in next steps</h2>
            <p style={{ marginBottom: "8px" }}>Comments section goes here.</p>
            <p style={{ margin: 0 }}>Watch list actions go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}