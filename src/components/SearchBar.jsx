import "./SearchBar.css"

function SearchBar({ value, onChange, ref }) {
  return (
    <div className="search-bar">
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("")
            e.currentTarget.blur()
          }
        }}
        placeholder="Search notes... (press / to focus)"
        aria-label="Search notes"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => {
            onChange("")
            ref?.current?.focus()
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar