import styles from "./CommentList.module.css";

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <div className={styles.empty}>No comments yet. Be the first to comment.</div>;
  }

  return (
    <div className={styles.root}>
      {comments.map((comment) => (
        <article key={comment.id} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.authorBlock}>
              <span className={styles.author}>{comment.username}</span>
              <span className={styles.meta}>Viewer comment</span>
            </div>

            <span className={styles.meta}>
              {formatCommentDate(comment.createdAt)}
            </span>
          </div>

          <p className={styles.content}>{comment.content}</p>
        </article>
      ))}
    </div>
  );
}

function formatCommentDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}