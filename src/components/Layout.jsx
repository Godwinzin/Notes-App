import { Suspense } from "react"
import { Outlet, NavLink, useLocation } from "react-router"
import Header from "./Header"
import ErrorBoundary from "./ErrorBoundary"
import { useSettings } from "../context/SettingsContext"
import "./Layout.css"

function navClass({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link"
}

function Layout() {
  const { resolvedTheme, setTheme } = useSettings()
  const location = useLocation()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Switch to light theme" : "Switch to dark theme"

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header title="My Notes" />

      <nav className="nav" aria-label="Main">
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

      <main id="main" tabIndex={-1}>
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<p className="loading">Loading…</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default Layout