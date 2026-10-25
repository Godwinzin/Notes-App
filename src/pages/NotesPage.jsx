import { useState, useMemo, useRef, useEffect } from "react"
import Greeting from "../components/Greeting"
import NoteCard from "../components/NoteCard"
import NoteForm from "../components/NoteForm"
import SearchBar from "../components/SearchBar"
import SortMenu from "../components/SortMenu"
import useDebounce from "../hooks/useDebounce"
import useLocalStorage from "../hooks/useLocalStorage"
import { useNotes } from "../context/NotesContext"
import { useSettings } from "../context/SettingsContext"

function NotesPage() {
  const {
    notes,
    addNote,
    togglePin,
    updateNote,
    deleteNote,
    clearNotes,
    unpinAll,
  } = useNotes()
  const { userName } = useSettings()

  const [query, setQuery] = useState("")
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [sortBy, setSortBy] = useLocalStorage("notes-app:sort", "newest")
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      const active = document.activeElement
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.isContentEditable

      if (e.key === "/" && !isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

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

    const ordered = [...result]
    if (sortBy === "oldest") ordered.reverse()
    if (sortBy === "title") {
      ordered.sort((a, b) => a.title.localeCompare(b.title))
    }

    return ordered.sort((a, b) => b.pinned - a.pinned)
  }, [notes, debouncedQuery, pinnedOnly, sortBy])

  const pinnedCount = notes.filter((note) => note.pinned).length
  const isFiltering = debouncedQuery.trim() !== "" || pinnedOnly

  return (
    <>
      <Greeting name={userName} />
      <NoteForm onAddNote={addNote} />

      {notes.length > 0 && (
        <>
          <SearchBar ref={searchRef} value={query} onChange={setQuery} />

          <div className="toolbar">
            <div className="stats">
              <span className="badge">Total: {notes.length}</span>
              {pinnedCount > 0 && (
                <span className="badge badge--pinned">
                  Pinned: {pinnedCount}
                </span>
              )}
              {pinnedCount > 0 && (
                <button className="btn-link" onClick={unpinAll}>
                  Unpin all
                </button>
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

            <div className="toolbar__actions">
              <SortMenu value={sortBy} onChange={setSortBy} />
              <button className="btn-clear" onClick={clearNotes}>
                Clear all
              </button>
            </div>
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