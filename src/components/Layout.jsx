import { Outlet, NavLink } from "react-router"
import { Suspense } from "react"
import Header from "./Header"
import { useSettings } from "../context/SettingsContext"
import "./Layout.css"

function navClass({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link"
}

function Layout() {
  const { resolvedTheme, setTheme } = useSettings()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Switch to light theme" : "Switch to dark theme"

  return (
    <div className="app">
      <Header title="My Notes" />

      <nav className="nav">
        <NavLink to="/" end className={navClass}>
          Notes
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          Settings
        </NavLink>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={label}
          title={label}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </nav>

     <main>
      <Suspense fallback={<p className="loading">Loading…</p>}>
        <Outlet />
      </Suspense>
    </main>
    </div>
  )
}

export default Layout