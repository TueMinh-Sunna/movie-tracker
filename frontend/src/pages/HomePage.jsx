import { useState } from "react";
import { getPing } from "../api/pingApi";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleTestBackend() {
    setError("");
    setMessage("");

    try {
      const result = await getPing();
      setMessage(result);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleTestBackend}>Test Backend Ping</button>

      {message && <p>Backend says: {message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}