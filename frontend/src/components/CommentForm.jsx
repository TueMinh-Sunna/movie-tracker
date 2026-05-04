import { useState } from "react";
import { validateCommentForm } from "../utils/validation";
import styles from "./CommentForm.module.css";

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

  const characterCount = content.length;
  const maxLength = 1000;

  const isNearLimit = characterCount > 900;
  const isOverLimit = characterCount > maxLength;
  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="comment-content" className={styles.label}>
            Write a comment
          </label>
          <span className={styles.helperText}>Max 1000 characters</span>
        </div>

        <textarea
          id="comment-content"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setFieldErrors((current) => ({ ...current, content: "" }));
          }}
          rows={5}
          placeholder="Share your thoughts about this anime..."
          className={styles.textarea}
        />
        {isOverLimit && (
          <div className={styles.error}>
            Comment exceeds 1000 characters.
          </div>
        )}

        {fieldErrors.content ? (
          <div className={styles.error}>{fieldErrors.content}</div>
        ) : null}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.actions}>
        <span
          className={`${styles.counter} ${isOverLimit
            ? styles.counterError
            : isNearLimit
              ? styles.counterWarning
              : ""
            }`}
        >
          {characterCount}/{maxLength}
        </span>

        <button
          type="submit"
          disabled={submitting || isOverLimit || characterCount === 0}
          className={styles.submitButton}
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}