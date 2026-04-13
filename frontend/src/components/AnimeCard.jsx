import { Link } from "react-router-dom";

export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/anime/${anime.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          backgroundColor: "#fff",
          height: "100%",
        }}
      >
        <img
          src={anime.imageUrl}
          alt={anime.title}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        />

        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{anime.title}</h3>

        <p style={{ margin: "0", color: "#555" }}>
          Rating: {anime.averageRating && anime.averageRating > 0
            ? anime.averageRating
            : "No ratings yet"}
        </p>
      </div>
    </Link>
  );
}