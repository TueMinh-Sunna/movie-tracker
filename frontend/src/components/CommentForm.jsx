import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Please enter a comment.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(trimmedContent);
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Write a comment
        </label>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          placeholder="Share your thoughts about this anime..."
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      {error && (
        <p style={{ color: "crimson", marginBottom: "10px" }}>{error}</p>
      )}

      <button type="submit" disabled={submitting} style={{ padding: "10px 16px" }}>
        {submitting ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}