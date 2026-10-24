import { createContext, useContext } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [userName, setUserName] = useLocalStorage("notes-app:name", "")

  return (
    <SettingsContext value={{ userName, setUserName }}>
      {children}
    </SettingsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === null) {
    throw new Error("useSettings must be used inside <SettingsProvider>")
  }
  return context
}