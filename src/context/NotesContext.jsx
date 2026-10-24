import { createContext, useContext, useReducer, useEffect } from "react"
import { notesReducer } from "./notesReducer"
import initialNotes from "../data/notes"

const STORAGE_KEY = "notes-app:notes"

const NotesContext = createContext(null)

function loadNotes(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, initialNotes, loadNotes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  function addNote({ title, content, pinned }) {
    const note = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      title,
      content,
      pinned,
    }
    dispatch({ type: "added", note })
  }

  function togglePin(id) {
    dispatch({ type: "pin_toggled", id })
  }

  function updateNote(id, changes) {
    dispatch({ type: "updated", id, changes })
  }

  function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return false
    dispatch({ type: "deleted", id })
    return true
  }

  function clearNotes() {
    if (!window.confirm("Delete ALL notes?")) return
    dispatch({ type: "cleared" })
  }

  const value = { notes, addNote, togglePin, updateNote, deleteNote, clearNotes }

  return <NotesContext value={value}>{children}</NotesContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotes() {
  const context = useContext(NotesContext)
  if (context === null) {
    throw new Error("useNotes must be used inside <NotesProvider>")
  }
  return context
}