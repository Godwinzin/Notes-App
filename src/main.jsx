import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { SettingsProvider } from "./context/SettingsContext"
import { NotesProvider } from "./context/NotesContext"
import "./index.css"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <NotesProvider>
          <App />
        </NotesProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
)