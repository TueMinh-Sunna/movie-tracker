export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <option value="">Default sort</option>
      <option value="rating_desc">Rating: High to Low</option>
      <option value="rating_asc">Rating: Low to High</option>
    </select>
  );
}