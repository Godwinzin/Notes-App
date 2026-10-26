function TagFilter({ tags, active, onSelect }) {
  if (tags.length === 0) return null

  return (
    <div className="tag-filter" role="group" aria-label="Filter by tag">
      {tags.map(({ name, count }) => (
        <button
          key={name}
          type="button"
          className={name === active ? "tag tag--active" : "tag"}
          aria-pressed={name === active}
          onClick={() => onSelect(name === active ? "" : name)}
        >
          #{name} <span className="tag__count">{count}</span>
        </button>
      ))}
    </div>
  )
}

export default TagFilter