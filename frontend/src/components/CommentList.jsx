export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p>No comments yet. Be the first to comment.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <strong>{comment.username}</strong>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {formatCommentDate(comment.createdAt)}
            </span>
          </div>

          <p style={{ margin: 0, lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {comment.content}
          </p>
        </div>
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