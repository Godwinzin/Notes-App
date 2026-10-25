export function notesReducer(notes, action) {
  switch (action.type) {
    case "added":
      return [action.note, ...notes]

    case "pin_toggled":
      return notes.map((note) =>
        note.id === action.id ? { ...note, pinned: !note.pinned } : note
      )

    case "updated":
      return notes.map((note) =>
        note.id === action.id ? { ...note, ...action.changes } : note
      )

    case "deleted":
      return notes.filter((note) => note.id !== action.id)

    case "cleared":
      return []

    case "all_unpinned":
      return notes.map((note) =>
        note.pinned ? { ...note, pinned: false } : note
      )
//Testing....
      case "test_added":
      return [...action.notes, ...notes]

    case "test_removed":
      return notes.filter((note) => !note.isTest)

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}