export default function WatchStatusSelect({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <option value="WATCH_LATER">Watch later</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}