export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by title..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        maxWidth: "320px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}