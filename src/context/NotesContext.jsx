import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react"
import { notesReducer } from "./notesReducer"
import { useConfirm } from "./ConfirmContext"
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
  const confirm = useConfirm()
  const [notes, dispatch] = useReducer(notesReducer, initialNotes, loadNotes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = useCallback(({ title, content, pinned, tags = [] }) => {
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
      tags,
    }
    dispatch({ type: "added", note })
  }, [])

  const togglePin = useCallback((id) => {
    dispatch({ type: "pin_toggled", id })
  }, [])

  const updateNote = useCallback((id, changes) => {
    dispatch({ type: "updated", id, changes })
  }, [])

  const deleteNote = useCallback(
    async (id, title) => {
      const ok = await confirm({
        title: "Delete this note?",
        message: title
          ? `“${title}” will be permanently deleted.`
          : "This note will be permanently deleted.",
        confirmText: "Delete",
        danger: true,
      })
      if (!ok) return false
      dispatch({ type: "deleted", id })
      return true
    },
    [confirm]
  )

  const noteCount = notes.length

  const clearNotes = useCallback(async () => {
    const ok = await confirm({
      title: "Delete all notes?",
      message: `All ${noteCount} notes will be permanently deleted.`,
      confirmText: "Delete all",
      danger: true,
    })
    if (!ok) return
    dispatch({ type: "cleared" })
  }, [confirm, noteCount])

  const unpinAll = useCallback(() => {
    dispatch({ type: "all_unpinned" })
  }, [])

  const addTestNotes = useCallback((count) => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: crypto.randomUUID(),
      title: `Test note ${i + 1}`,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(3),
      date: "1 Jan 2026",
      pinned: false,
      isTest: true,
    }))
    dispatch({ type: "test_added", notes: generated })
  }, [])

  const removeTestNotes = useCallback(() => {
    dispatch({ type: "test_removed" })
  }, [])

  const value = useMemo(
    () => ({
      notes,
      addNote,
      togglePin,
      updateNote,
      deleteNote,
      clearNotes,
      unpinAll,
      addTestNotes,
      removeTestNotes,
    }),
    [
      notes,
      addNote,
      togglePin,
      updateNote,
      deleteNote,
      clearNotes,
      unpinAll,
      addTestNotes,
      removeTestNotes,
    ]
  )

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