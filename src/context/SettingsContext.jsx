import { createContext, useContext, useEffect } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import useMediaQuery from "../hooks/useMediaQuery"

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [userName, setUserName] = useLocalStorage("notes-app:name", "")
  const [theme, setTheme] = useLocalStorage("notes-app:theme", "system")
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)")

  const resolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.add("theme-transition")
    root.dataset.theme = resolvedTheme

    const id = setTimeout(() => root.classList.remove("theme-transition"), 300)
    return () => clearTimeout(id)
  }, [resolvedTheme])

  return (
    <SettingsContext
      value={{ userName, setUserName, theme, setTheme, resolvedTheme }}
    >
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