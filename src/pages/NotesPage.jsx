import { useState, useMemo } from "react"
import Greeting from "../components/Greeting"
import NoteCard from "../components/NoteCard"
import NoteForm from "../components/NoteForm"
import SearchBar from "../components/SearchBar"
import useDebounce from "../hooks/useDebounce"
import { useNotes } from "../context/NotesContext"
import { useSettings } from "../context/SettingsContext"

function NotesPage() {
  const { notes, addNote, togglePin, updateNote, deleteNote, clearNotes } =
    useNotes()
  const { userName } = useSettings()

  const [query, setQuery] = useState("")
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const visibleNotes = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    let result = notes

    if (pinnedOnly) {
      result = result.filter((note) => note.pinned)
    }

    if (q !== "") {
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q)
      )
    }

    return [...result].sort((a, b) => b.pinned - a.pinned)
  }, [notes, debouncedQuery, pinnedOnly])

  const pinnedCount = notes.filter((note) => note.pinned).length
  const isFiltering = debouncedQuery.trim() !== "" || pinnedOnly

  return (
    <>
      <Greeting name={userName} />
      <NoteForm onAddNote={addNote} />

      {notes.length > 0 && (
        <>
          <SearchBar value={query} onChange={setQuery} />

          <div className="toolbar">
            <div className="stats">
              <span className="badge">Total: {notes.length}</span>
              {pinnedCount > 0 && (
                <span className="badge badge--pinned">
                  Pinned: {pinnedCount}
                </span>
              )}
              {isFiltering && (
                <span className="badge">
                  Showing {visibleNotes.length} of {notes.length}
                </span>
              )}
              <label className="filter-check">
                <input
                  type="checkbox"
                  checked={pinnedOnly}
                  onChange={(e) => setPinnedOnly(e.target.checked)}
                />
                Pinned only
              </label>
            </div>
            <button className="btn-clear" onClick={clearNotes}>
              Clear all
            </button>
          </div>
        </>
      )}

      {notes.length === 0 && (
        <p className="empty">No notes yet. Create your first one!</p>
      )}

      {notes.length > 0 && visibleNotes.length === 0 && (
        <p className="empty">No notes match your filters.</p>
      )}

      <div className="note-list">
        {visibleNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            date={note.date}
            pinned={note.pinned}
            onTogglePin={togglePin}
            onDelete={deleteNote}
            onSave={updateNote}
          />
        ))}
      </div>
    </>
  )
}

export default NotesPage