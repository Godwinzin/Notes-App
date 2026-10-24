import { Routes, Route } from "react-router"
import Layout from "./components/Layout"
import NotesPage from "./pages/NotesPage"
import NotePage from "./pages/NotePage"
import SettingsPage from "./pages/SettingsPage"
import NotFoundPage from "./pages/NotFoundPage"
import useDocumentTitle from "./hooks/useDocumentTitle"
import { useNotes } from "./context/NotesContext"
import "./App.css"

function App() {
  const { notes } = useNotes()

  useDocumentTitle(notes.length > 0 ? `My Notes (${notes.length})` : "My Notes")

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NotesPage />} />
        <Route path="notes/:id" element={<NotePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App