import { Link } from "react-router-dom";

export default function AnimeCard({
  anime,
  actions = null,
  subtitle = null,
}) {
  const hasRating = anime.averageRating > 0;

  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        to={`/anime/${anime.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          flex: 1,
        }}
      >
        <img
          src={anime.imageUrl}
          alt={anime.title}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div style={{ padding: "12px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
            {anime.title}
          </h3>

          <p style={{ margin: "0 0 8px 0", color: "#555" }}>
            Rating: {hasRating ? anime.averageRating.toFixed(1) : "No ratings yet"}          </p>

          {subtitle ? (
            <div style={{ color: "#666", fontSize: "14px" }}>{subtitle}</div>
          ) : null}
        </div>
      </Link>

      {actions ? (
        <div
          style={{
            padding: "0 12px 12px 12px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {actions}
        </div>
      ) : null}
    </article>
  );
}