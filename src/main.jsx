import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { SettingsProvider } from "./context/SettingsContext"
import { ConfirmProvider } from "./context/ConfirmContext"
import { NotesProvider } from "./context/NotesContext"
import "./index.css"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <ConfirmProvider>
          <NotesProvider>
            <App />
          </NotesProvider>
        </ConfirmProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
)