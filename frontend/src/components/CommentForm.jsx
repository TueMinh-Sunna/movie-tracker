import { useState } from "react";
import { validateCommentForm } from "../utils/validation";

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const nextFieldErrors = validateCommentForm(content);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(content.trim());
      setContent("");
      setFieldErrors({});
    } catch (err) {
      setError(err.message || "Failed to post comment.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Write a comment
        </label>

        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setFieldErrors((current) => ({ ...current, content: "" }));
          }}
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

        {fieldErrors.content && (
          <p style={{ color: "crimson", margin: "6px 0 0" }}>
            {fieldErrors.content}
          </p>
        )}
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