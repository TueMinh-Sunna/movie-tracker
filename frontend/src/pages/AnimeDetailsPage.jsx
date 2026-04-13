import { useParams } from "react-router-dom";

export default function AnimeDetailsPage() {
  const { id } = useParams();

  return <h1>Anime Details Page - ID: {id}</h1>;
}